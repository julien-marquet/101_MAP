const users_func = require("./Users.func"),
    {apiEndpoint, connectedUsers_cacheExpiration} = require("../config/globalConfig");

class Users {
    constructor(globalStorage, Oauth2_authenticator, i_queue) {
        this.globalStorage = globalStorage;
        this.globalStorage.usersInfos = {};
        this.i_queue = i_queue;
        this.Oauth2_authenticator = Oauth2_authenticator;
    }

    getUserInfos(userId, userToken) {
        if (this.globalStorage.usersInfos[userId] === undefined) {
            return this.i_queue.push_tail(
                "getUserInfos", {
                    url: `${apiEndpoint}v2/users/${userId}`, 
                    headers: {"authorization": `Bearer ${userToken}`}
                }
            ).then(response => {
                response.last_request = Date.now();
                this.globalStorage.usersInfos[response.id] = response;
                return ({response});
            })
                .catch(err => {
                    if (err && err.infos && err.infos.status === 401) {
                        return this.Oauth2_authenticator.refreshToken(userToken)
                            .then((refreshed) => {
                                if (refreshed) {
                                    return this.i_queue.push_tail(
                                        "getUserInfos", {
                                            url: `${apiEndpoint}v2/users/${userId}`, 
                                            headers: {"authorization": `Bearer ${refreshed}`
                                            }
                                        }
                                    ).then(response => {
                                        response.last_request = Date.now();
                                        this.globalStorage.usersInfos[response.id] = response;
                                        return ({response, refresh_token: refreshed});
                                    });
                                } else {
                                    throw ("try to refresh, no existing entry");
                                }
                            });
                    }
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
                                if (pageArray && pageArray.length > 0)
                                {
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
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    self.globalStorage.connected_users_array = {};
                    usersArray.map(({begin_at, user, id, host}) => {
                        self.globalStorage.connected_users_array[host] = {
                            begin_at,
                            user,
                            id
                        };
                    });
                    self.globalStorage.connected_users_last_request = Date.now();
                    self.globalStorage.nb_connected_users = nb_connected_users;
                    if (usersArray.length > 0) {
                        resolve({
                            nb_connected_users: self.globalStorage.nb_connected_users,
                            last_request: self.globalStorage.connected_users_last_request, 
                            array: self.globalStorage.connected_users_array
                        });
                    }
                    else {
                        reject("can't get connected users");
                    }        
                }
            }());
        });
    }             
}

module.exports = Users;
    