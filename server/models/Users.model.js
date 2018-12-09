class UsersModel {
	constructor(psql) {
		this.psql = psql;
	}

	getConnectedUsers() {
		return psql.query("");
	}
}

module.exports = UsersModel;

