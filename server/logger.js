const Log = require('mongoose').model('Log');
const globalConfig = require("./config/globalConfig")

exports.add_log = function(type = null, content = null, user = null) {
    if (globalConfig.streamLogToConsole)
    {
        console.log(`${type} = ${content}`);
    }
    const log = new Log({
        type,
        content
    });
    log.save().then(() => {}, (err) => {
        throw err;
    });
};