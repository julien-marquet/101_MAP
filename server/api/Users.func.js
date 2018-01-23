const   request = require("request");

const   {apiEndpoint} = require("../config/globalConfig"),
    logger = require("../custom_modules/logger");

const users_func = {
    selectNull :(array) => {
        const dest = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].end_at === null)
                dest.push(array[i]);
        }
        return (dest);
    },
    getPageOfConnectedUsers: (token, campus, pagination, callback) => {
        request.get({
            url: `${apiEndpoint}/v2/campus/${campus}/locations?page=${pagination}&sort=-end_at,host&page=${pagination}`,
            headers: {
                "Authorization": "Bearer " + token.access_token
            }
        }, (err, res, body) => {
            if (!err && body) {
                body = JSON.parse(body);
                
                if (body.length > 0) {
                    body = users_func.selectNull(body);
                    callback(body);
                }
                else
                    callback(null);
            }
            else {
                logger.add_log({
                    type: "Error", 
                    description: "Couldn't get campus data", 
                    additionnal_infos: {
                        Error: err
                    }
                });
                callback(null);
            }
        });
    }
};
module.exports = users_func;