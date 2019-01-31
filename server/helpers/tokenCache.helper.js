const fs = require("fs");
const logger = require("./logger.helper");

module.exports = {
    saveTokens: globalStorage => {
        try {
            const fd = fs.openSync(`${__dirname}/../tmpTokens.js`, "w");
            fs.writeSync(fd, "module.exports = {");
            Object.keys(globalStorage.socketCache).map(token => fs.writeSync(fd, `"${token}":{refresh_token:"${globalStorage.socketCache[token].refresh_token}",userId:${globalStorage.socketCache[token].userId}},`));
            fs.writeSync(fd, "}");
            fs.closeSync(fd);
        } catch (error) {
            logger.add_log({
                type: "Error",
                description: "An error occured during writing tokens to file",
                additionnal_infos: {Error: error}
            });
        }
        process.exit(0);
    }
};
