const {apiEndpoint, blocId} = require("../config/globalConfig");

class CoalitionsApi {
    constructor(queue, oauth) {
        this.queue = queue;
        this.oauth = oauth;
    }

    getCoalitions() {
        return this.oauth.getToken()
            .then(({access_token}) => {
                return this.queue.push_tail(
                    "getCoalitions", {
                        url: `${apiEndpoint}v2/blocs/${blocId}/coalitions`, 
                        headers: {"authorization": `Bearer ${access_token}`}
                    }
                );
            });
    }
}

module.exports = CoalitionsApi;
