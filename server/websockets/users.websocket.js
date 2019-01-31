const logger = require("../helpers/logger.helper");

const usersSocket = (socket, globalStorage, i_queue, i_OAuth2_authenticator, i_users_api) => {
    socket.on("users.get.all", () => {
        if (!globalStorage.connected_users_array) {
            i_users_api.getConnectedUsers(9).then(result => {
                socket.emit("connectedUsers", JSON.stringify(result));
                logger.add_log({
                    type:"General", 
                    description:"Emit connectedUsers from Request"
                });
            }).catch(error => {
                socket.emit("connectedUsers", JSON.stringify({"error": true, "message": "Couldn't get users"}));
                logger.add_log({
                    type: "Error",
                    description: "Couldn't retrieve connectedUsers from request",
                    additionnal_infos: {error}
                });		
            });
        } else {
            logger.add_log({
                type:"General", 
                description:"Emit connectedUsers from Cache"
            });
            socket.emit("connectedUsers", JSON.stringify({
                last_request: globalStorage.connected_users_last_request, 
                nb_connected_users: globalStorage.nb_connected_users,
                array: globalStorage.connected_users_array,
                inPoolNbr: globalStorage.inPoolNbr,
                coalitions: globalStorage.coalitions || []
            }));
        }
    });
    socket.on("user.get.infos", ({login, userToken}) => {
        if (!userToken ||userToken === undefined) {
            logger.add_log({
                type:"Error", 
                description:"Request UserInfos Failed", 
                additionnal_infos: {
                    Error: "No token provided by the client"
                }
            });                
            socket.emit("error.fetch", "No token provided");
        } else {
            i_users_api.getUserInfos(login, userToken)
                .then(response => {
                    logger.add_log({
                        type:"General", 
                        description:"Request UserInfos Succeeded"
                    });
                    socket.emit("user.getted.infos", response);
                })
                .catch(error => {
                    logger.add_log({
                        type:"General", 
                        description:"Request UserInfos Failed", 
                        additionnal_infos: {
                            Error: error
                        }
                    });          
                    socket.emit("error.fetch", "An error occured during fetch");
                });
        }
    });
};

module.exports = usersSocket;
