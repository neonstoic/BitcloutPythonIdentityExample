from base58check import b58encode, b58decode
import hashlib
from hashlib import sha256
import jwt
import base64
import ecdsa
import binascii

class BitcloutIdentity:

    def __init__(self, bitcloutPublicKey):
        print("BitcloutIdentity init")
        self.publicKey = bitcloutPublicKey

    def validateJWT(self, jwtToken):
        # decode base58check get key bytes plus checksum
        print('validating publicKey"' + self.publicKey + '"')
        data_bytes = b58decode( self.publicKey )
        key_bytes = data_bytes[:-4]
        checksum = data_bytes[-4:]

        # verify publickey checksum
        data_hash = hashlib.sha256(hashlib.sha256(key_bytes).digest()).digest()
        if not checksum == data_hash[0:4]:
            print('Checksum is wrong.') 
            return False   
        else:
            print('publickey checksup verified')
            
        # Get ecdsa verification key from publickey
        public_key = key_bytes.hex().upper()
        jwtParts = jwtToken.split(".")
        signedStr = ".".join(jwtParts[0:2]).encode(encoding="ASCII")
        signature = base64.urlsafe_b64decode(jwtParts[2] + '==')
        pub_key = data_bytes[3 : len(data_bytes)-4]
        vk = ecdsa.VerifyingKey.from_string(pub_key, curve=ecdsa.SECP256k1,  hashfunc = hashlib.sha256) # the default is sha1

        # Try to verify signature of jwt with verification key
        try:
            if vk.verify(signature, signedStr, sha256):
                return True
            else:    
                return False
        except ecdsa.BadSignatureError:
            print("verification failed")
        return False
