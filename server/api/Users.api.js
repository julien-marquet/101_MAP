const fetch = require("node-fetch");

const users_func = require("./Users.func"),
    {apiEndpoint} = require("../config/globalConfig");

class Users {
    constructor(globalStorage, Oauth2_authenticator) {
        this.globalStorage = globalStorage;
        this.Oauth2_authenticator = Oauth2_authenticator;
    }

    getUserInfos(userId, userToken) {
        return fetch(`${apiEndpoint}/v2/users/${userId}`, {
            headers: {"authorization": `Bearer ${userToken}`}
        })
            .then(response => response.json())
            .catch(error => {
                return {error};
            });
    }

    getConnectedUsers(campus, callback)  {
        let i = 1;
        let usersArray = [];
        let self = this;
        (function loop() {
            if (i !== -1) {
                self.Oauth2_authenticator.getToken(token => {
                    if (token) {
                        users_func.getPageOfConnectedUsers(token, campus, i, pageArray => {
                            if (!pageArray || pageArray.length < 30) {
                                if (pageArray && pageArray.length > 0)
                                    usersArray = usersArray.concat(pageArray);
                                i = -1;
                            }
                            else {
                                usersArray = usersArray.concat(pageArray);
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
                if (usersArray.length > 0) {
                    callback({
                        success:true,
                        content:{
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
    