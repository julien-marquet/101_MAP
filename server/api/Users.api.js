const users_func = require("./Users.func"),
    logger = require("../custom_modules/logger"),
    {apiEndpoint, connectedUsers_cacheExpiration} = require("../config/globalConfig");

class Users {
    constructor(globalStorage, Oauth2_authenticator, i_queue) {
        this.globalStorage = globalStorage;
        this.globalStorage.usersInfos = {};
        this.i_queue = i_queue;
        this.Oauth2_authenticator = Oauth2_authenticator;
    }

    getUserInfos(userId, userToken) {
        const sendRequests = token => Promise.all([this.i_queue.push_tail(
            "getUserInfos", {
                url: `${apiEndpoint}v2/users/${userId}`,
                headers: {"authorization": `Bearer ${token}`}
            }
        ), this.i_queue.push_tail(
            "getUserCoalition", {
                url: `${apiEndpoint}v2/users/${userId}/coalitions`,
                headers: {"authorization": `Bearer ${token}`}
            }
        )]);
        if (this.globalStorage.usersInfos[userId] === undefined) {
            return sendRequests(userToken)
                .then(response => {
                    response = {
                        ...response[0],
                        last_request: Date.now(),
                        coalition: response[1].length === 0 || response[1][0].slug.includes("piscine") ? null : {...response[1][0]}
                    };
                    this.globalStorage.usersInfos[response.id] = response;
                    return ({response});
                })
                .catch(err => {
                    if (err && err.infos && err.infos.status === 401) {
                        return this.Oauth2_authenticator.refreshToken(userToken)
                            .then(refreshed => {
                                if (refreshed) {
                                    return sendRequests(refreshed)
                                        .then(response => {
                                            response = {
                                                ...response[0],
                                                last_request: Date.now(),
                                                coalition: response[1].length === 0 || response[1][0].slug.includes("piscine") ? null : {...response[1][0]}
                                            };
                                            this.globalStorage.usersInfos[response.id] = response;
                                            return ({response, refresh_token: refreshed});
                                        });
                                } else {
                                    logger.add_log({
                                        type: "Error",
                                        description: "Try to refresh...",
                                        additionnal_infos: {userToken, refreshedToken: refreshed}
                                    });
                                    throw ("try to refresh, no existing entry");
                                }
                            })
                            .catch(error => {
                                logger.add_log({
                                    type: "Error", 
                                    description: "An unknown error during token refresh",
                                    additionnal_infos: {Error: error}
                                });
                                throw ("Couldn't refresh token");
                            });
                    }
                    logger.add_log({
                        type: "Error",
                        description: "Unknown error occured (maybe api down)",
                        additionnal_infos: {Error: err}
                    });
                    throw ("Unknown error occured");
                });
        }
        else {
            if ((Date.now() - this.globalStorage.usersInfos[userId].last_request) / 1000 > connectedUsers_cacheExpiration * 60) {
                delete(this.globalStorage.usersInfos[userId]);
                return (this.getUserInfos(userId, userToken));
            }
            else {
                return new Promise(resolve => resolve({response: this.globalStorage.usersInfos[userId]}));
            }
        }
    }

    getConnectedUsers(campus)  {
        return new Promise((resolve, reject) => {
            let i = 1;
            let usersArray = [];
            let self = this;
            let nb_connected_users = 0;
            (function loop() {
                if (i !== -1) {
                    self.Oauth2_authenticator.getToken().then(token => {
                        users_func.getPageOfConnectedUsers(token, campus, i, self.i_queue.push_head.bind(self.i_queue)).then(pageArray => {
                            if (!pageArray || pageArray.length < 30) {
                                if (pageArray && pageArray.length > 0) {
                                    pageArray = users_func.selectValid(pageArray);
                                    usersArray = usersArray.concat(pageArray);
                                    nb_connected_users += pageArray.length;
                                }
                                i = -1;
                            }
                            else if (pageArray !== null){
                                pageArray = users_func.selectValid(pageArray);
                                usersArray = usersArray.concat(pageArray);
                                nb_connected_users += pageArray.length;
                                i++;
                            }
                            else {
                                i = -1;
                            }
                            loop();
                        }).catch(err => reject(err));
                    }).catch(err => reject(err));
                } else {
					resolve(usersArray);
				}
            }());
        });
    }
}

module.exports = Users;
    
