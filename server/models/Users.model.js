class UsersModel {
	constructor(psql) {
		this.psql = psql;
	}

	getConnectedUsers() {
		return this.psql.query("SELECT * FROM logtimes_logtimes AS logs WHERE logs.end_at IS NULL")
			.then(result => result.rows);
	}
}

module.exports = UsersModel;

