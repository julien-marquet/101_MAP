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
    getPageOfConnectedUsers: (token, campus, pagination, push_head, callback) => {
        push_head("getUsersList", {
            url: `${apiEndpoint}v2/campus/${campus}/locations?page=${pagination}&sort=-end_at,host&page=${pagination}`,
            headers: {
                "Authorization": "Bearer " + token.access_token
            }
        })
            .then(response => {
                if (response.length > 0) {
                    response = users_func.selectNull(response);
                    callback(response);
                }
                else
                    callback(null);
            })
            .catch(error => {
                logger.add_log({
                    type: "Error", 
                    description: "Couldn't get campus data", 
                    additionnal_infos: {
                        Error: error
                    }
                });
                callback(null);
            });
    }
};
module.exports = users_func;