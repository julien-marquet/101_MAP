const	fs = require('fs');

const	users_api = require("./api/Users.api"),
		Oauth2_authenticator = require('./OAuth2_authenticator');

const websocketHandler = (server, globalStorage) => {
	const	io = require('socket.io')(server);

	const	i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage),
			i_users_api = new users_api(globalStorage, i_Oauth2_authenticator),
			loop_request = require('./websocket_event/loop_request')(io, globalStorage, i_Oauth2_authenticator, i_users_api);       

	globalStorage.connectedUsers = 0;
	io.use(require('./middlewares/Oauth_client_authentifier.middleware'));
	io.on('connection', (socket) => {
		globalStorage.connectedUsers++;
		if (!globalStorage.connected_users_array)
		{
			i_users_api.getConnectedUsers(9, (result) => {
				if (result.success)
					socket.emit("connectedUsers", JSON.stringify(result.content));
				else
					socket.emit("connectedUsers", JSON.stringify({"error": true, "message": result.message}));
			});
		} else {
			socket.emit("connectedUsers", JSON.stringify({
				last_request: globalStorage.connected_users_last_request, 
				array: globalStorage.connected_users_array
			}));
		}
		socket.on('disconnect', (data) => {
			globalStorage.connectedUsers--;
		})
		const websocket_event_handlers = require('./websocket_event/index')(socket, globalStorage);
	});
}
module.exports = websocketHandler;