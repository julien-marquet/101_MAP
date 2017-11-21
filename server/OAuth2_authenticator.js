const   request = require('request');
var     globalState = require('./globalState');

var Oauth2_authenticator = {
    getToken: function (callback) {
        if (globalState.access_token === null || (globalState.access_token.created_at + globalState.access_token.expires_in) * 1000 < Date.now()) {
            console.log("generating fresh token");
            request.post({
                url: process.env.API + "/oauth/token",
                form: {
                    grant_type: 'client_credentials',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET
                }
            }, function (err, res, body) {
                if (!err)
                {
                    body = JSON.parse(body);
                    globalState.access_token = body;
                    callback(body);
                }
                else {
                    console.log("error getting API access token : " + err);
                    callback(null);
                }
            });
        }
        else
        {
            console.log("retrieving token from cache");
            callback(globalState.access_token);
        }
    }
};

module.exports = Oauth2_authenticator;