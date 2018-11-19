const logger = require("../custom_modules/logger");
const CoalitionsApi = require("../api/Coalitions.api");

class CoalitionsController {
    constructor(globalStorage, queue, oauth) {
        this.globalStorage = globalStorage;
        this.coalitions = new CoalitionsApi(queue, oauth);
    }

    updateScores() {
        return this.coalitions.getCoalitions()
            .then(coalitions => this.globalStorage.coalitions = coalitions)
            .catch(error => logger.add_log({
                type: "Error",
                description: "Getting coalitions",
                additionnal_infos: {error}
            }));
    }
}

module.exports = CoalitionsController;
