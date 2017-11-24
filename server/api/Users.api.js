const request = require('request');
const users_func = require('./Users.func');
const {refreshRate} = require('../config/globalConfig');


class Users {
    constructor(globalStorage, Oauth2_authenticator) {
        this.globalStorage = globalStorage;
        this.Oauth2_authenticator = Oauth2_authenticator;
    }
    getConnectedUsers(campus, callback)  {
        if (this.globalStorage.connected_users_last_request && this.globalStorage.connected_users_last_request + refreshRate * 1000 > Date.now()) {
            console.log("result taken from cache");
            callback({
                success:true,
                content:{
                    last_request: this.globalStorage.connected_users_last_request, 
                    array: this.globalStorage.connected_users_array
                }});
        }
        else {
            console.log("generating fresh result");
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
                    self.globalStorage.connected_users_array = usersArray;
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
};
    
    module.exports = Users;
    