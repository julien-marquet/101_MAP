const request = require('request'),
fs = require('fs');

const {apiEndpoint, refreshRate} = require('../config/globalConfig');

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
    }
};

(function readDir(dir = __dirname) {
    fs.readdirSync(dir).map(file => {
        if (fs.lstatSync(`${dir}/${file}`).isDirectory())
            readDir(`${dir}/${file}`);
        else {
            if (file.includes('.api.js')) {
                API_request = {
                    ...API_request,
                    ...require(`${dir}/${file}`)
                };
            }
        }
    });
})();

module.exports = API_request;