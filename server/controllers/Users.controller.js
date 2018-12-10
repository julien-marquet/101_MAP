const UsersApi = require("../api/Users.api");
const UsersModel = require("../models/Users.model");

class UsersController {
    constructor(globalStorage, queue, oauth, psql) {
        this.globalStorage = globalStorage;
        this.users = new UsersApi(queue, oauth, queue);
		this.usersModel = new UsersModel(psql);
    }

	getConnectedUsers() {
		const promise = this.globalStorage.psqlStatus ? this.usersModel.getConnectedUsers() : this.users.getConnectedUsers(9);
		return promise
			.then(users => {
				this.globalStorage.connected_users_array = {};
				users.map(({host, begin_at, user, id, login, hostname}) => {
					this.globalStorage.connected_users_array[host || hostname] = {
						id,
						begin_at,
						login: user !== undefined ? user.login : login
					};
				});
				this.globalStorage.connected_users_last_request = Date.now();
				this.globalStorage.nb_connected_users = users.length;
				this.globalStorage.inPoolNbr = 0;
				return {
					nb_connected_users: this.globalStorage.nb_connected_users,
					last_request: this.globalStorage.connected_users_last_request,
					array: this.globalStorage.connected_users_array,
					inPoolNbr: this.globalStorage.inPoolNbr,
					coalitions: this.globalStorage.coalitions || []
				};
			});
	}
}

module.exports = UsersController;
