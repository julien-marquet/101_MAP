const   Log = require("mongoose").model("Log"),
    globalConfig = require("./config/globalConfig");

exports.add_log = function(obj_log) {
    if (globalConfig.streamLogToConsole)
    {
        switch(obj_log.type) {
        case "Error": console.error(`\x1b[31m${new Date().toLocaleTimeString()} : ${obj_log.description || null} ${obj_log.additionnal_infos || ""}\x1b[0m`);
            break ;
        case "Warning": console.warn(`\x1b[33m${new Date().toLocaleTimeString()} : ${obj_log.description || null} ${obj_log.additionnal_infos || ""}\x1b[0m`);
            break ;
        default : console.info(`${new Date().toLocaleTimeString()} : ${obj_log.description || null} ${obj_log.additionnal_infos || ""}`);
            break ;
        }
    }
    const log = new Log(obj_log);
    log.save().then(() => {}, (err) => {
        throw err;
    });
};