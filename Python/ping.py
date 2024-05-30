from subprocess import check_output as execute

command = ['ping', '-c', '1', '8.8.8.8']

print(len(str(execute(command)).split('\\\n')))