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
            if (res)
                callback(true);
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
            if (!token) {
                is_valid_code(i_Oauth2_authenticator, socket.handshake.query.code, code_token => {
                    if (!code_token)
                        next(new Error("Authentication error"));
                    else {
                        socket.typeAuth = "code";
                        socket.userToken = code_token.access_token;
                        next();
                    }
                });
            }
            else {
                socket.typeAuth = "token";
                socket.userToken = socket.handshake.query.token; 
                next();
            }
        });
    });
};

module.exports = Oauth_authentifier;