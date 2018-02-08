const SocketCache = require("../custom_classes/SocketCache.js");
const {flushSocketCache_loopRate} = require("../config/globalConfig");

const loop_socketCache = (globalStorage) => {
    const i_socketCache = new SocketCache(globalStorage);
    setInterval(()=> {
        i_socketCache.flushToken();
    }, flushSocketCache_loopRate * 1000 * 60);
};

module.exports = loop_socketCache;