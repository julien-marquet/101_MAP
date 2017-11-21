const request = require('request'),
    Oauth2_authenticator = require('./OAuth2_authenticator');
var globalState = require('./globalState');

var API_request = {
    test: function (token, callback) {
        request.get({
            url: process.env.API + "/v2/me",
            headers: {
                'Authorization': 'Bearer ' + token.access_token
            }
        }, function (err, res, body) {
            if (!err)
                callback(body);
            else {
                console.log("error getting testing API : " + err);
                callback(null);
            }
        });
    },
    get101: function (token, callback) {
        request.get({
            url: process.env.API + " /v2/campus/9",
            headers: {
                'Authorization': 'Bearer ' + token.access_token
            }
        }, function (err, res, body) {
            if (!err)
                callback(body);
            else {
                console.log("error getting campus data : " + err);
                callback(null);
            }
        });
    },
    getConnectedUsers: function (campus, callback) {
        if (globalState.connected_users.last_request && globalState.connected_users.last_request + process.env.REFRESH_RATE * 1000 > Date.now()) {
            console.log("result taken from cache");
            callback(globalState.connected_users.array);
        } else {
            console.log("generating fresh result");
            var i = 1;
            var usersArray = [];

            (function loop() {
                if (i !== -1) {
                    Oauth2_authenticator.getToken(function (token) {
                        getPageOfConnectedUsers(token, campus, i, function (pageArray) {
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

function getPageOfConnectedUsers(token, campus, pagination, callback) {
    request.get({
        url: process.env.API + "/v2/campus/" + campus + "/locations?page=" + pagination + "&sort=-end_at,host&page=" + pagination,
        headers: {
            'Authorization': 'Bearer ' + token.access_token
        }
    }, function (err, res, body) {
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
}

function selectNull(array) {
    var dest = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].end_at === null)
            dest.push(array[i]);
    }
    return (dest);
}

module.exports = API_request;