var loginWindow = null;
var approveWindow = null;
var iframe = null;

targetOrigin = 'https://identity.bitclout.com';

const userinfo = {
    publicKey : null,
    accessLevelHMAC : null,
    btcDepositAddress : null,
    encryptedSeedHex : null,
    accessLevel : 2,
    jwt : null
};

function getWindowSpecs(){
    h = 1000;
    w = 800;
    y = window.outerHeight / 2 + window.screenY - h / 2;
    x = window.outerWidth / 2 + window.screenX - w / 2;
    return {h:h, w:w, y:y, x:x};
};

function startBitcloutLogin(){
    windowSpecs = getWindowSpecs();
    loginWindow = window.open('https://identity.bitclout.com/log-in', '_blank', `toolbar=no, width=${windowSpecs.w}, height=${windowSpecs.h}, top=${windowSpecs.y}, left=${windowSpecs.x}`);
}

function _handleLoginEvent(payload) {
    console.log(payload);
    iframe = document.getElementById("identity");

    if (loginWindow) {
        loginWindow.close();
        loginWindow = null;

        userinfo.publicKey = payload.publicKeyAdded;
        for(var i in payload.users) { 
            if(i == payload.publicKeyAdded){
                p = payload.users[i];
                userinfo.accessLevel = p.accessLevel;
                userinfo.accessLevelHMAC = p.accessLevelHmac;
                userinfo.btcDepositAddress = p.btcDepositAddress;
                userinfo.encryptedSeedHex = p.encryptedSeedHex;

                var reqid = uuidv4();

                var jwtRequest = {
                    id: reqid,
                    service: 'identity',
                    method: 'jwt',
                    payload: {
                      accessLevel: userinfo.accessLevel,
                      accessLevelHmac: userinfo.accessLevelHMAC,
                      encryptedSeedHex: userinfo.encryptedSeedHex
                    }
                }

                iframe.contentWindow.postMessage(jwtRequest, "*");
            }
        }
    }
}

function _finishLogin(jwt){
    console.log('Received jwt. Finalizing login.');
    console.log(jwt);
    document.getElementById('jwt').value = jwt;
    document.getElementById('pubkey').value = userinfo.publicKey;
    document.getElementById('loginform').submit();
}

function _showLoginApproval(tx){
    windowSpecs = getWindowSpecs();
    var approveWindow = window.open(`https://identity.bitclout.com/approve?tx=${tx}`, '_blank', `toolbar=no, width=${windowSpecs.w}, height=${windowSpecs.h}, top=${windowSpecs.y}, left=${windowSpecs.x}`);
}

window.addEventListener('message', (event) => {
    if(event.origin == 'https://identity.bitclout.com'){
        console.log(event);
        if(event.data.method == 'initialize'){
            event.source.postMessage({id: event.data.id, service:"identity", payload:{}}, "*");
        }else if (event.data.method == 'login') {
            _handleLoginEvent(event.data.payload);
        }else if(event.data.payload.approvalRequired =! null && event.data.payload.approvalRequired == true){
            console.log('login approval required.');
            _showLoginApproval();
        }else if (event.data.payload.jwt != null){
            console.log("Received jwt");
            _finishLogin(event.data.payload.jwt);
        }
    }
});