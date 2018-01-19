const Log = require('mongoose').model('Log');
const globalConfig = require("./config/globalConfig")

exports.add_log = function(obj_log) {
    if (globalConfig.streamLogToConsole)
        console.log(`${obj_log.type || "General"} = ${obj_log.description || null} ${obj_log.additionnal_infos || ""}`);
    const log = new Log({
        ...obj_log
    });
    log.save().then(() => {}, (err) => {
        throw err;
    });
};