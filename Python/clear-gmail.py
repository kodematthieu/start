#!/usr/bin/env python
import imaplib, inquirer, email, socket, json, sys, re
from os import path
from email.header import decode_header

EMAIL_REGEX = r'''(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])'''

Email,Password,Iterations = None,None,None

if len(sys.argv) == 2:
    filepath = path.abspath(sys.argv[1])
    try:
        file = json.load(open(filepath, 'r'))
        Email = file.get('Email', file.get('email', None))
        if Email != None and (re.match('^'+EMAIL_REGEX+'$', Email) == None or type(Email) != str): sys.exit('Email: \'{}\' is not a valid email!'.format(Email))
        Password = file.get('Password', file.get('password', file.get('pass', None)))
        Iterations = file.get('Iterations', file.get('iter', None))
        if Iterations != None and type(Iterations) != int: sys.exit('Iterations: \'{}\' is not a number!'.format(Iterations))
    except FileNotFoundError: sys.exit('FileNotFound: {}'.format(sys.argv[1]))
    except json.decoder.JSONDecodeError: sys.exit('JSON.parse: Invalid JSON file')
elif len(sys.argv) > 2:
    Email = sys.argv[1] if re.match('^'+EMAIL_REGEX+'$', sys.argv[1]) else sys.exit('Email: \'{}\' is not a valid email!'.format(sys.argv[1]))
    Password = sys.argv[2]
    if len(sys.argv) > 3: Iterations = int(sys.argv[3]) if re.match('^\d+$', sys.argv[3]) else sys.exit('Iterations: \'{}\' is not a number!'.format(sys.argv[3]))
    else: Iterations = 0

questions = []
if Email == None: questions.append(inquirer.Text('email', message='Email', validate=lambda _,x: re.match('^'+EMAIL_REGEX+'$', x)))
if Password == None: questions.append(inquirer.Password('password', message='Password'))
if Iterations == None: questions.append(inquirer.Text('number', message='Iterations', validate=lambda _,x: re.match(r'^\d+$', x)))
answers = inquirer.prompt(questions)
if answers == None: sys.exit()
Email = answers.get('email', Email)
Password = answers.get('password', Password)
Iterations = max(int(answers.get('number', Iterations)), 1)

try: m = imaplib.IMAP4_SSL('imap.gmail.com')
except socket.gaierror: sys.exit('No Internet Connection!')

try: m.login(Email, Password)
except imaplib.IMAP4.error: sys.exit('Login failed!')

x = 0

def start(iterCount):
    if iterCount == 0: return
    mail_len = int(m.select('"[Gmail]/All Mail"')[1][0])
    if mail_len == 0: return
    _, messages = m.search(None, 'All')
    messages = messages[0].split(b' ')
    for mail in messages:
        global x
        m.store(mail, '+X-GM-LABELS', '\\Trash')
        m.expunge()
        print('\033[36m{}\033[0m \033[33mMail(s) Moved To Trash\033[0m'.format(x+1), mail)
        x += 1
    start(iterCount - 1)

try: 
    # print(m.list())
    start(Iterations)
except KeyboardInterrupt: pass
finally:
    try: m.close()
    except imaplib.IMAP4.error: pass
    m.logout()
    
