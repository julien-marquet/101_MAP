const request = require('request');

const Oauth2_authenticator = require('../OAuth2_authenticator'),
{apiEndpoint, refreshRate} = require('../config/globalConfig'),
globalState = require('../globalState');

function selectNull(array) {
    var dest = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].end_at === null)
            dest.push(array[i]);
    }
    return (dest);
}

const Users =  {
    getPageOfConnectedUsers: (token, campus, pagination, callback) => {
        request.get({
           url: `${apiEndpoint}/v2/campus/${campus}/locations?page=${pagination}&sort=-end_at,host&page=${pagination}`,
           headers: {
               'Authorization': 'Bearer ' + token.access_token
           }
       }, (err, res, body) => {
           if (!err) {
               body = JSON.parse(body);
    
               if (body.length > 0) {
                   body = selectNull(body);
                   callback(body);
               }
               else
                   callback(null);
           }
           else {
               console.log("error getting campus data : " + err);
               callback(null);
           }
       });
    },
    getConnectedUsers: (campus, callback) => {
        if (globalState.connected_users.last_request && globalState.connected_users.last_request + refreshRate * 1000 > Date.now()) {
            console.log("result taken from cache");
            callback(globalState.connected_users.array);
        } else {
            console.log("generating fresh result");
            let i = 1;
            let usersArray = [];
            
            (function loop() {
                if (i !== -1) {
                    Oauth2_authenticator.getToken(token => {
                        Users.getPageOfConnectedUsers(token, campus, i, pageArray => {
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
                    });
                } else {
                    globalState.connected_users.array = usersArray;
                    globalState.connected_users.last_request = Date.now();
                    callback(usersArray.length > 0);
                }
            }());
        }
    }
};

module.exports = Users;
