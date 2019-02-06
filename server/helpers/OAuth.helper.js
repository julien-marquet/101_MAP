const   {apiEndpoint, redirect_uri} = require("../config/globalConfig"),
    logger = require("./logger.helper"),
    SocketCache = require("./SocketCache.helper");

class Oauth2_authenticator {
    constructor(globalStorage, i_queue) {
        this.globalStorage = globalStorage;
        this.i_queue = i_queue;
        this.i_socketCache = new SocketCache(globalStorage);
    }
    refreshToken(token) {
        return new Promise((resolve, reject) => {
            if (!this.globalStorage.socketCache[token]) {
                return resolve(null);
            }
            this.i_queue.push_head("refreshToken", {
                url: `${apiEndpoint}oauth/token`,
                body: {
                    refresh_token: this.globalStorage.socketCache[token].refresh_token,
                    redirect_uri: redirect_uri,
                    grant_type: "refresh_token",
                },
                method: "POST"
            })
                .then((refreshToken) => {
                    if (refreshToken && !refreshToken.error) {
                        logger.add_log({
                            type: "General",
                            description: "Refreshing token...",
                            additionnal_infos: {token: refreshToken}
                        });
                        this.i_socketCache.addToken(refreshToken, this.globalStorage.socketCache[token].userId);
                        return resolve(refreshToken.access_token);
                    } else {
                        if (refreshToken !== null && refreshToken.error !== null) {
                            return reject(refreshToken.error);
                        }
                    }
                })
                .catch(error => {
                    logger.add_log({
                        type: "Warning",
                        description: "Couldn't refresh user access token", 
                        additionnal_infos: {Error: error}
                    });
                    return reject(error);
                });
        });
    }

    getUserToken(code) {
        if (code === undefined || code === null) {
            return Promise.reject("No code provided");
        }
        return this.i_queue.push_head("getUserToken", {
            url: `${apiEndpoint}oauth/token`,
            body: {
                code,
                redirect_uri,
                grant_type: "authorization_code",
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            },
            method: "POST"
        })
            .then(token => this.i_queue.push_head("tokenInfo", {
                method: "GET",
                url: `${apiEndpoint}oauth/token/info`,
                headers: {Authorization: `Bearer ${token.access_token}`}
            })
                .then(tokenInfo => {
                    this.i_socketCache.addToken(token, tokenInfo.resource_owner_id);
                    return {
                        ...token,
                        userId: tokenInfo.resource_owner_id
                    };
                }));
    }

    testTokenValidity(token) {
        return this.i_socketCache.searchToken(token);
    }

    getToken() {
        return new Promise ((resolve, reject) => {
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
                        resolve(res);
                    } else {
                        logger.add_log({
                            type: "Error", 
                            description: "Couldn't get API access token", 
                            additionnal_infos: {
                                Error: res.error
                            }
                        });
                        reject(res.error);
                    }
                }, (err) => {
                    logger.add_log({
                        type: "Error", 
                        description: "Couldn't get API access token", 
                        additionnal_infos: {
                            Error: err
                        }
                    });
                    reject(err);
                });
            }
            else {
                resolve(this.globalStorage.access_token);
            }        
        });
    }
}

module.exports = Oauth2_authenticator;
