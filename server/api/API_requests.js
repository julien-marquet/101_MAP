const request = require('request'),
    {apiEndpoint, refreshRate} = require('../config/globalConfig'),
    Users = require('./Users');

var API_request = {
    test: function (token, callback) {
        request.get({
            url: `${apiEndpoint}/v2/me`,
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
            url: `${apiEndpoint}/v2/campus/9`,
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
    ...Users
};

function selectNull(array) {
    var dest = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].end_at === null)
            dest.push(array[i]);
    }
    return (dest);
}

module.exports = API_request;