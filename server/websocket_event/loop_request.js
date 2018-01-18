const users_api = require("../api/Users.api");
const logger = require("../logger");

const loop_request = (io, globalStorage,i_Oauth2_authenticator, i_users_api) => {
    setInterval(()=> {
        if (globalStorage.connectedUsers > 0)
        {
            logger.add_log("General", "Starting periodic request connectedUsers");            
            i_users_api.getConnectedUsers(9, (result) => {
                if (result.success) {
                    io.sockets.emit("connectedUsers", JSON.stringify(result.content));
                    logger.add_log("General", "Periodic request connectedUsers Succeeded");                                
                }
                else
                {
                  io.sockets.emit("connectedUsers", JSON.stringify({"error": true, "message": result.message}));
                  logger.add_log("Error", "Periodic request connectedUsers Failed");                                                  
                }
            });
        }
    }, 30000);
};

module.exports = loop_request;