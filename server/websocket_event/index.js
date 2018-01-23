const fs = require("fs");

const eventHandler = (socket, globalStorage, i_queue) => {
    (function readDir(dir = __dirname) {
        fs.readdirSync(dir).map(file => {
            if (fs.lstatSync(`${dir}/${file}`).isDirectory())
                readDir(`${dir}/${file}`);
            else {
                if (file.includes(".websocket.js"))
                    require(`${dir}/${file}`)(socket, globalStorage, i_queue);
            }
        });
    })();
};

module.exports = eventHandler;