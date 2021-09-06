import requests
import json

endpoint = 'https://api.bitclout.com'

def getUserHodlings(publicKey, username, checkForKey=None):
    # method gets holdings for publickey
    data = { 'PublicKeyBase58Check':publicKey, 'Username':username, 'FetchAll':True}
    response = requests.post(endpoint+"/get-hodlers-for-public-key", json=data)
    data = json.loads(response.text)
    if(checkForKey != None ):
        for hodler in data['Hodlers']:
            k = hodler['HODLerPublicKeyBase58Check']
            print(k)
            if(k == checkForKey):
                return True
        return False
    return data
        
def getUserInfo(publicKey):
    #method gets all the details for the publickey
    data = { 'PublicKeyBase58Check':publicKey}
    response = requests.post(endpoint+"/get-single-profile", json=data)
    if response.status_code == 200:
        data = json.loads(response.text)

        ret = {}
        ret['username'] = data['Profile']['Username']
        return ret
    return None