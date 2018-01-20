const   request = require('request');

const   {apiEndpoint, client_id, client_secret, redirect_uri} = require('./config/globalConfig'),
        logger = require("./logger")

class Oauth2_authenticator {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
    }
    getUserToken(code, callback) {
        request.post({
            url: `${apiEndpoint}/oauth/token`,
            form: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            }
        }, (err, res, body) => {
            if (!err && body) {
                body = JSON.parse(body);
                if (body.error) 
                    callback(null);
                else 
                    callback(body);
            } else {
                logger.add_log({type: "Error", description: `Couldn't get user access token`, additionnal_infos: err});
                callback(null);
            }
        });
    }
    testTokenValidity(token, callback) {
        request.get({
            url: `${apiEndpoint}/oauth/token/info`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        }, (err, res, body) => {
            if (!err && body) {
                body = JSON.parse(body);
                if (body.error) {
                    logger.add_log({type: "Error", description: `Couldn't validate user access token`, additionnal_infos: body.error});
                    callback(false);
                }
                else 
                    callback(true);
            }
            else {
                logger.add_log({type: "Error", description: `Couldn't validate user access token`, additionnal_infos: err});
                callback(false);
            }
        })
    }
    getToken(callback) {
        if (!this.globalStorage.access_token || (this.globalStorage.access_token.modified_at + this.globalStorage.access_token.expires_in * 1000 < Date.now() - 2000)) {
            logger.add_log({type: "General", description: "A fresh API token has been generated"});
            request.post({
                url: `${apiEndpoint}oauth/token`,
                form: {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'client_credentials'
                }
            }, (err, res, body) => {
                if (!err && body) {
                    body = JSON.parse(body);
                    if (body.error) {
                        logger.add_log({type: "Error", description: `Couldn't get API access token`, additionnal_infos: body.error});
                        callback(null);
                    }
                    else {
                        this.globalStorage.access_token = body;
                        this.globalStorage.access_token.modified_at = Date.now();
                        callback(body);
                    }
                }
                else {
                    logger.add_log({type: "Error", description: `Couldn't get API access token`, additionnal_infos: err});
                    callback(null);
                }
            });
        }
        else {
            callback(this.globalStorage.access_token);
        }
    }
};

module.exports = Oauth2_authenticator;
