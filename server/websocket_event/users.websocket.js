const   Users = require("../api/Users.api"),
    authenticator = require("../OAuth2_authenticator"),
    logger = require("../logger");

const usersSocket = (socket, globalStorage) => {
    const auth = new authenticator(globalStorage);
    const UsersModel = new Users(globalStorage, auth);
    socket.on("user.get.infos", ({userId, userToken}) => {
        UsersModel.getUserInfos(userId, userToken)
            .then(response => {
                if (response.error ) {
                    logger.add_log({type:"Error", description:`Request UserInfos Failed. details : ${response.error}`});
                    socket.emit("error.fetch", response.error);
                }          
                else {
                    logger.add_log({type:"General", description:"Request UserInfos Succeeded"});
                    socket.emit("user.getted.infos", response);
                }
            })
            .catch(error => {
                logger.add_log({type:"General", description:`Request UserInfos Failed. details : ${error}`});                
                socket.emit("error.fetch", error)
            });
    });
};

module.exports = usersSocket;
