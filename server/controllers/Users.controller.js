const UsersApi = require("../api/Users.api");
const UsersModel = require("../models/Users.model");

class UsersController {
    constructor(globalStorage, queue, oauth, psql) {
        this.globalStorage = globalStorage;
        this.users = new UsersApi(queue, oauth);
		this.usersModel = new UsersModel(psql);
    }

	getConnectedUsers() {
		console.log("Getting connectedUsers", this.globalStorage.get("psqlStatus"));
		if (this.globalStorage.get("psqlStatus")) {
			return this.usersModel.getConnectedUsers()
				.then(this.users.getConnectedUsers(9));
		} else {
			return this.users.getConnectedUsers(9);
		}
	}
}

module.exports = UsersController;
