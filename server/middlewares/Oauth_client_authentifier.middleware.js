function is_valid_token(i_Oauth2_authenticator, token) {
    if (token && token !== "undefined") {
        const res = i_Oauth2_authenticator.testTokenValidity(token);
        if (res !== null)
            return res;
        else
            return false;
    }
    else 
        return false;
}


const Oauth_authentifier = i_Oauth2_authenticator => {
    return ((socket, next) => {
        const token = is_valid_token(i_Oauth2_authenticator, socket.handshake.query.token);
        if (token === false) {
            i_Oauth2_authenticator.getUserToken(socket.handshake.query.code).then(code_token => {
                socket.userId = code_token.userId;
                socket.typeAuth = "code";
                socket.userToken = code_token.access_token;
                socket.checked_at = Math.floor(Date.now()/1000);
                socket.expires_in = code_token.expires_in;
                next();
            }).catch(err => {
                next(new Error(`Authentication error ${err}`));
            });
        }
        else {
            socket.typeAuth = "token";
            next();
        }
    });
};

module.exports = Oauth_authentifier;