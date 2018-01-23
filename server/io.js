const	Users_api = require("./api/Users.api"),
    Oauth2_authenticator = require("./custom_classes/OAuth2_authenticator"),
    Queue = require("./custom_classes/Queue"),
    logger = require("./custom_modules/logger");

const websocketHandler = (server, globalStorage) => {
    const	io = require("socket.io")(server);
    const   i_queue = new Queue(globalStorage),
        i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage),
        i_users_api = new Users_api(globalStorage, i_Oauth2_authenticator, i_queue);

    require("./loopers/loop_request")(io, globalStorage, i_Oauth2_authenticator, i_users_api);
    require("./loopers/loop_queue")(i_queue);       

    globalStorage.connectedUsers = 0;

    io.use(require("./middlewares/Oauth_client_authentifier.middleware")(globalStorage));
	
    io.on("connection", (socket) => {
        logger.add_log({
            type:"General", 
            description:"Socket Connection established"
        });		
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
                    logger.add_log({
                        type:"General", 
                        description:"Emit connectedUsers from Request"
                    });
                }
                else
                {
                    socket.emit("connectedUsers", JSON.stringify({"error": true, "message": result.message}));
                    logger.add_log({
                        type:"Error", 
                        description:"couldn't Retrieve connectedUsers from Request"
                    });					
                }	
            });
        } else {
            logger.add_log({
                type:"General", 
                description:"Emit connectedUsers from Cache"
            });
            setTimeout(() => {
                socket.emit("connectedUsers", JSON.stringify({
                    last_request: globalStorage.connected_users_last_request, 
                    array: globalStorage.connected_users_array
                }));
            }, 500);
        }
        socket.on("disconnect", () => {
            logger.add_log({
                type:"General", 
                description:"Socket Connection Lost"
            });			
            globalStorage.connectedUsers--;
        });
        require("./websocket_event/index")(socket, globalStorage, i_queue);
    });
};
module.exports = websocketHandler;