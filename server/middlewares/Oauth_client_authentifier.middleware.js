function is_valid_code(i_Oauth2_authenticator, code, callback)  {
    if (code) {
        i_Oauth2_authenticator.getUserToken(code, token => {
            if (token)
                callback(token);
            else
                callback(false);
        });
    }
    else 
        callback(false);
}

function is_valid_token(i_Oauth2_authenticator, token, callback) {
    if (token && token !== "undefined") {
        i_Oauth2_authenticator.testTokenValidity(token, res => {
            if (res !== null)
                callback(res);
            else
                callback(false);
        });
    }
    else 
        callback(false);
}


const Oauth_authentifier = ( i_Oauth2_authenticator) => {
    return ((socket, next) => {
        is_valid_token(i_Oauth2_authenticator, socket.handshake.query.token, token => {
            if (token === false) {
                is_valid_code(i_Oauth2_authenticator, socket.handshake.query.code, code_token => {
                    if (!code_token)
                        next(new Error("Authentication error"));
                    else {
                        socket.typeAuth = "code";
                        socket.userToken = code_token.access_token;
                        socket.checked_at = Math.floor(Date.now()/1000);
                        socket.expires_in = code_token.expires_in;
                        next();
                    }
                });
            }
            else {
                socket.typeAuth = "token";
                next();
            }
        });
    });
};

module.exports = Oauth_authentifier;