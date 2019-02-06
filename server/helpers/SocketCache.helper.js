class SocketCache {
    constructor(globalStorage) {
        this.globalStorage = globalStorage;
        this.globalStorage.socketCache = {};

        this.addToken = this.addToken.bind(this);
    }

    addToken(token, userId) {
        Object.keys(this.globalStorage.socketCache).map((key) => {
            if (this.globalStorage.socketCache[key].userId === userId) {
                delete this.globalStorage.socketCache[key];
            }
        });
        this.globalStorage.socketCache[token.access_token] = {
            userId,
            refresh_token: token.refresh_token,
            checked_at: Math.floor(Date.now()/1000),
            expires_in: token.expires_in
        };
    }

    searchToken(userToken) {
        const tmp = this.globalStorage.socketCache[userToken];
        if (tmp != undefined) {
            if (tmp.checked_at + tmp.expires_in >= Math.floor(Date.now() / 1000)) {
                return ({
                    ...tmp,
                    access_token: userToken
                });
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

module.exports = SocketCache;

