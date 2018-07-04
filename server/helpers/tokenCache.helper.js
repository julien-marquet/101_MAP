const fs = require("fs");

module.exports = {
    saveTokens: globalStorage => {
        try {
            const fd = fs.openSync("./tmpTokens.js", "w");
            fs.writeSync(fd, "module.exports = {");
            Object.keys(globalStorage.socketCache).map(token => fs.writeSync(fd, `"${token}":{refresh_token:"${globalStorage.socketCache[token].refresh_token}",userId:${globalStorage.socketCache[token].userId}},`));
            fs.writeSync(fd, "}");
            fs.closeSync(fd);
        } catch (error) {
            console.log("An error occured during writing tokens to file", error);
        }
        process.exit(0);
    }
};
