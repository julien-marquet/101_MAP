const Oauth2_authenticator = require('../OAuth2_authenticator');   
const i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage);    

function is_valid(code, callback)  {
    console.log(!!code);
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

const Oauth_authentifier = (req, res, next) => {
    is_valid(req.query.code, valid => {
        if (!valid)
        {
            res.writeHead(302, {'Location': 'https://api.intra.42.fr/oauth/authorize?client_id=ec554f6910bc61665c6b05abe37b1a0a08b5589fad33614029d5453de6d3a481&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=code'});
            res.end();
        }
        else
            next();
    })
};

module.exports = Oauth_authentifier;