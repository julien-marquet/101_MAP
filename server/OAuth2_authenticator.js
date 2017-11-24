const   request = require('request');
const {apiEndpoint, client_id, client_secret} = require('./config/globalConfig');

class Oauth2_authenticator {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
    }

    getToken(callback) {
        if (!this.globalStorage.access_token || (this.globalStorage.access_token.created_at + this.globalStorage.access_token.expires_in) * 1000 < Date.now()) {
            console.log("generating fresh token");
            request.post({
                url: `${apiEndpoint}/oauth/token`,
                form: {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'client_credentials'
                }
            }, (err, res, body) => {
                if (!err ) {
                    body = JSON.parse(body);
                    if (body.error) {
                        console.log("error getting API access token : " + (body.error));
                        callback(null);
                    }
                    else {
                        this.globalStorage.access_token = body;
                        callback(body);
                    }
                }
                else {
                    console.log("error getting API access token : " + (err));
                    callback(null);
                }
            });
        }
        else {
            console.log("retrieving token from cache");
            callback(this.globalStorage.access_token);
        }
    }
};

module.exports = Oauth2_authenticator;
