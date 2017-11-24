const   request = require('request');
const {apiEndpoint, client_id, client_secret} = require('./config/globalConfig');

class Oauth2_authenticator {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
    }
    getUserToken(code, callback)
    {
        console.log({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            redirect_uri: 'http%3A%2F%2Flocalhost%3A8080%2F',
            grant_type: 'authorization_code'
        })
        request.post({
            url: `${apiEndpoint}/oauth/token`,
            form: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: code,
                redirect_uri: 'http://localhost:8080/',
                grant_type: 'authorization_code'
            }
        }, (err, res, body) => {
            if (!err ) {
                body = JSON.parse(body);
                if (body.error) {
                    console.log("error getting USER access token : " + (body.error));
                    callback(null);
                }
                else {
                    callback(body);
                }
            }
            else {
                console.log("error getting USER access token : " + (err));
                callback(null);
            }
        });
    }
    getToken(callback) {
        if (!this.globalStorage.access_token || (this.globalStorage.access_token.modified_at + this.globalStorage.access_token.expires_in * 1000 < Date.now() - 2000)) {
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
                        this.globalStorage.access_token.modified_at = Date.now();
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
