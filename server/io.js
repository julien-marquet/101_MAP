const	fs = require('fs');

const	users_api = require("./api/Users.api"),
		Oauth2_authenticator = require("./OAuth2_authenticator"),
		logger = require("./logger");

const websocketHandler = (server, globalStorage) => {
	const	io = require('socket.io')(server);

	const	i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage),
			i_users_api = new users_api(globalStorage, i_Oauth2_authenticator),
			loop_request = require('./websocket_event/loop_request')(io, globalStorage, i_Oauth2_authenticator, i_users_api);       

	globalStorage.connectedUsers = 0;

	io.use(require('./middlewares/Oauth_client_authentifier.middleware')(globalStorage));
	
	io.on('connection', (socket) => {
		logger.add_log({type:"General", description:"Socket Connection established"});		
		socket.emit("authSuccess", {
			type: socket.typeAuth,
			token: socket.userToken
		});
		globalStorage.connectedUsers++;
		if (!globalStorage.connected_users_array)
		{
			i_users_api.getConnectedUsers(9, (result) => {
				if (result.success){
					socket.emit("connectedUsers", JSON.stringify(result.content));
					logger.add_log({type:"General", description:"Emit connectedUsers from Request"});
				}
				else
				{
					socket.emit("connectedUsers", JSON.stringify({"error": true, "message": result.message}));
					logger.add_log("Error", "couldn't Retrieve connectedUsers from Request");					
				}	
			});
		} else {
			logger.add_log({type:"General", description:"Emit connectedUsers from Cache"});			
			socket.emit("connectedUsers", JSON.stringify({
				last_request: globalStorage.connected_users_last_request, 
				array: globalStorage.connected_users_array
			}));
		}
		socket.on('disconnect', (data) => {
			logger.add_log({type:"General", description:"Socket Connection Lost"});			
			globalStorage.connectedUsers--;
		})
		const websocket_event_handlers = require('./websocket_event/index')(socket, globalStorage);
	});
}
module.exports = websocketHandler;