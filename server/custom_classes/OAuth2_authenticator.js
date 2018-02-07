const   {apiEndpoint, redirect_uri} = require("../config/globalConfig"),
    logger = require("../custom_modules/logger"),
    SocketCache = require("../custom_classes/SocketCache");

class Oauth2_authenticator {
    constructor(globalStorage, i_queue) {
        this.globalStorage = globalStorage;
        this.i_queue = i_queue;
        this.i_socketCache = new SocketCache(globalStorage);
    }
    getUserToken(code, callback) {
        this.i_queue.push_head("getUserToken", {
            url: `${apiEndpoint}oauth/token`,
            body: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: code,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code"
            },
            method: "POST"
        }).then((res) => {
            if (res && !res.error) {
                this.i_socketCache.addToken(res);
                callback(res);
            } else {
                logger.add_log({
                    type: "Error",
                    description: "Couldn't get user access token", 
                    additionnal_infos: {
                        Error: res.error || "empty result"
                    }
                });
                callback(null);
            }
        }, (err) => {
            logger.add_log({
                type: "Error",
                description: "Couldn't get user access token", 
                additionnal_infos: {
                    Error: err
                }
            });
            callback(null);
        });
    }
    testTokenValidity(token, callback) {
        console.log(this.i_socketCache.searchToken(token));
        this.i_queue.push_head("testTokenValidity", {
            url: `${apiEndpoint}oauth/token/info`,
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then((res) => {
            if (res && !res.error) {
                callback(res);
            } else {
                logger.add_log({
                    type: "Error",
                    description: "Couldn't validate user access token", 
                    additionnal_infos: {
                        Error: res.error || "empty result"
                    }
                });
                callback(false);
            }
        }, (err) => {
            logger.add_log({
                type: "Error", 
                description: "Couldn't validate user access token", 
                additionnal_infos: {
                    Error:err
                }
            });
            callback(false);
        });
    }
    getToken(callback) {
        if (!this.globalStorage.access_token || this.globalStorage.access_token.modified_at + this.globalStorage.access_token.expires_in <= Math.floor(Date.now() / 1000)) {
            logger.add_log({
                type: "General", 
                description: "A fresh API token is being generated"
            });
            this.i_queue.push_head("getAPIToken", {
                url: `${apiEndpoint}oauth/token`,
                body: {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: "client_credentials"
                },
                method: "POST"
            }).then((res) => {
                if (res && !res.error) {
                    this.globalStorage.access_token = res;
                    this.globalStorage.access_token.modified_at = Math.floor(Date.now() / 1000);
                    callback(res);
                } else {
                    logger.add_log({
                        type: "Error", 
                        description: "Couldn't get API access token", 
                        additionnal_infos: {
                            Error: res.error
                        }
                    });
                    callback(null);
                }
            }, (err) => {
                logger.add_log({
                    type: "Error", 
                    description: "Couldn't get API access token", 
                    additionnal_infos: {
                        Error: err
                    }
                });
                callback(null);
            });
        }
        else {
            callback(this.globalStorage.access_token);
        }
    }
}

module.exports = Oauth2_authenticator;
