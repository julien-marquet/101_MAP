const logger = require("../custom_modules/logger");

class SocketCache {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
        this.globalStorage.socketCache = {
        };
        this.addToken = this.addToken.bind(this);
    }
    addToken(accessToken) {
        this.globalStorage.socketCache[accessToken.access_token] = {
            checked_at: Math.floor(Date.now()/1000),
            expires_in: accessToken.expires_in
        };
    }
    searchToken(userToken) {
        const tmp = this.globalStorage.socketCache[userToken];
        if (tmp != undefined) {
            if (tmp.checked_at + tmp.expires_in >= Math.floor(Date.now() / 1000))
            {
                return ({
                    ...tmp,
                    access_token: userToken
                });
            } else 
                return (null);
        }
        else 
            return (null);
    }
    flushToken() {
        const now = Math.floor(Date.now() / 1000);
        let cpt = 0;
        Object.keys(this.globalStorage.socketCache).map((key) => {
            if (this.globalStorage.socketCache[key].checked_at + this.globalStorage.socketCache[key].expires_in < now) {
                delete this.globalStorage.socketCache[key];
                cpt++;
            }
        });
        logger.add_log({
            type: "Info",
            description: "Expired tokens have been fleushed out", 
            additionnal_infos: {
                flushed_tokens: cpt
            }
        });
    }
}

module.exports = SocketCache;