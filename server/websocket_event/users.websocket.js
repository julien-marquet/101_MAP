const   Users = require("../api/Users.api"),
    logger = require("../custom_modules/logger");

const usersSocket = (socket, globalStorage, i_queue, i_OAuth2_authenticator) => {
    const i_users_api = new Users(globalStorage, i_OAuth2_authenticator, i_queue);
    socket.on("users.get.all", () => {
        if (!globalStorage.connected_users_array) {
            i_users_api.getConnectedUsers(9).then(result => {
                socket.emit("connectedUsers", JSON.stringify(result));
                logger.add_log({
                    type:"General", 
                    description:"Emit connectedUsers from Request"
                });
            }).catch(err => {
                socket.emit("connectedUsers", JSON.stringify({"error": true, "message": err}));
                logger.add_log({
                    type:"Error", 
                    description:"couldn't Retrieve connectedUsers from Request"
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
    socket.on("user.get.infos", ({userId, userToken}) => {
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
            i_users_api.getUserInfos(userId, userToken)
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
                    socket.emit("error.fetch", error);
                });
        }
    });
};

module.exports = usersSocket;
