# Bitclout Python Login/Identity Example

This is a working Python Flask app that uses the Bitclout Identity API for login.

Demo here: https://lime-juicy-opportunity.glitch.me/login

The application shows the following things :

1. Use of the client-side Bitclout identity API
2. Python code for validating a Bitclout JWT to ensure the user's public key is owned by them
3. A call to get a list of holders of NeonStoic creator coin
4. If the user holds NeonStoic, they are allowed to login

Some important notes about the implementation:
- The UI is super simple.
- This shouldn't be used for production. It's just a prototype/example.
- The JWT validation code is based on the example code in the Bitclout documentation, however it is missing the check to ensure the public key is on the eliptic curve. I'm not sure this is a huge issue, but please let me know otherwise (DM me on Bitclout perhaps.)

Reach out to me on Bitclout here : https://bitclout.com/u/NeonStoic
