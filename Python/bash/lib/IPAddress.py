import requests

URL_BASE = 'https://ipinfo.io/'
URL_IP = URL_BASE + 'ip'
URL_GEO = URL_BASE + '{}/json'

def IP(address = None):
    try:
        if type(address) != str: address = requests.get(URL_IP).text
        ret = requests.get(URL_GEO.format(address)).json()
        if ret.get('status', None) == 404 and ret['error']['title'] == 'Wrong ip': return 'Invalid IP'
        del ret['readme']
        ret['loc'] = {'lat': ret['loc'].split(',')[0], 'lon': ret['loc'].split(',')[1]}
        return ret
    except requests.exceptions.ConnectionError:
        return 'ConnectionError'