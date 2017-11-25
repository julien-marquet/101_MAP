const   Oauth2_authenticator = require('../OAuth2_authenticator'),
        i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage);    

function is_valid(code, callback)  {
    if (code)
    {
        i_Oauth2_authenticator.getUserToken(code, token => {
            if (token)
                callback(true);
            else
                callback(false);
        });
    }
    else {
        callback(false);
    }
}

const Oauth_authentifier = (socket, next) => {
    is_valid(socket.handshake.query.code, valid => {
        if (!valid)
            next(new Error('Authentication error'));
        else
            next();
    })
};

module.exports = Oauth_authentifier;