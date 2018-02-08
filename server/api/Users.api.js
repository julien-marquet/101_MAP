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
            return (this.i_queue.push_tail(
                "getUserInfos", {
                    url: `${apiEndpoint}v2/users/${userId}`, 
                    headers: {"authorization": `Bearer ${userToken}`
                    }
                }
            )).then(response => {
                response.last_request = Date.now();
                this.globalStorage.usersInfos[response.id] = response;
                return (response);
            });
        }
        else {
            if ((Date.now() - this.globalStorage.usersInfos[userId].last_request) / 1000 > connectedUsers_cacheExpiration * 60) {
                delete(this.globalStorage.usersInfos[userId]);
                return (this.getUserInfos(userId, userToken));
            }
            else {
                return (new Promise(resolve => resolve(this.globalStorage.usersInfos[userId])));
            }
        }
    }

    getConnectedUsers(campus, callback)  {
        let i = 1;
        let usersArray = [];
        let self = this;
        let nb_connected_users = 0;
        (function loop() {
            if (i !== -1) {
                self.Oauth2_authenticator.getToken(token => {
                    if (token) {
                        users_func.getPageOfConnectedUsers(token, campus, i, self.i_queue.push_head.bind(self.i_queue), pageArray => {
                            if (!pageArray || pageArray.length < 30) {
                                if (pageArray && pageArray.length > 0)
                                {
                                    pageArray = users_func.selectValid(pageArray);
                                    usersArray = usersArray.concat(pageArray);
                                    nb_connected_users += pageArray.length;
                                }
                                i = -1;
                            }
                            else {
                                pageArray = users_func.selectValid(pageArray);
                                usersArray = usersArray.concat(pageArray);
                                nb_connected_users += pageArray.length;
                                i++;
                            }
                            loop();
                        });
                    }
                    else 
                        callback({success: false, message: "can't get server token"});
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
                    callback({
                        success:true,
                        content:{
                            nb_connected_users: self.globalStorage.nb_connected_users,
                            last_request: self.globalStorage.connected_users_last_request, 
                            array: self.globalStorage.connected_users_array
                        }});
                }
                else {
                    callback({success: false, message: "can't get connected users"});
                }        
            }
        }());
    }
}

module.exports = Users;
    