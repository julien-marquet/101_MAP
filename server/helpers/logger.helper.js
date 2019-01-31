const   Log = require("mongoose").model("Log"),
    globalConfig = require("../config/globalConfig");

function print_additionnal_infos(infos) {
    let res = "";
    let str = "";
    if (infos) {
        const info_array = Object.entries(infos);
        res = "\n           Details :";
        info_array.forEach(info => {
            if (typeof info[1] === "object")
                str = JSON.stringify(info[1]);
            res += "\n           | ";
            res += `${info[0]} : ${str || info[1]}`;
        });
    }
    return res;
}

exports.add_log = function(obj_log) {
    if (globalConfig.streamLogToConsole)
    {
        switch(obj_log.type) {
        case "Error": console.error(`\x1b[31m${new Date().toLocaleTimeString()} : ${obj_log.description || null} ${print_additionnal_infos(obj_log.additionnal_infos)}\x1b[0m`);
            break ;
        case "Warning": console.warn(`\x1b[33m${new Date().toLocaleTimeString()} : ${obj_log.description || null} ${print_additionnal_infos(obj_log.additionnal_infos)}\x1b[0m`);
            break ;
        default : console.info(`${new Date().toLocaleTimeString()} : ${obj_log.description || null} ${print_additionnal_infos(obj_log.additionnal_infos)}`);
            break ;
        }
    }
    const log = new Log(obj_log);
    log.save().then(() => {}, (err) => {
        throw err;
    });
};