const   Users = require("../api/Users.api"),
    authenticator = require("../OAuth2_authenticator"),
    logger = require("../logger");

const usersSocket = (socket, globalStorage) => {
    const auth = new authenticator(globalStorage);
    const UsersModel = new Users(globalStorage, auth);
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
            UsersModel.getUserInfos(userId, userToken)
                .then(response => {
                    if (response.error ) {
                        logger.add_log({
                            type:"Error", 
                            description:"Request UserInfos Failed", 
                            additionnal_infos: {
                                Error: response.error
                            }
                        });               
                        socket.emit("error.fetch", response.error);
                    }          
                    else {
                        logger.add_log({
                            type:"General", 
                            description:"Request UserInfos Succeeded"
                        });
                        socket.emit("user.getted.infos", response);
                    }
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
