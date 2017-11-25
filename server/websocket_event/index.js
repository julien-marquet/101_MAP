const fs = require('fs');

const {clientPath} = require('../config/globalConfig');

const eventHandler = (socket, globalStorage) => {
    (function readDir(dir = __dirname) {
        fs.readdirSync(dir).map(file => {
            if (fs.lstatSync(`${dir}/${file}`).isDirectory())
                readDir(`${dir}/${file}`);
            else {
                if (file.includes('.websocket.js'))
                    require(`${dir}/${file}`)(socket, globalStorage);
            }
        });
    })();
};

module.exports = eventHandler;