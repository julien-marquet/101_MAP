const   Users = require("../api/Users.api"),
        authenticator = require("../OAuth2_authenticator"),
        logger = require("../logger");

const usersSocket = (socket, globalStorage) => {
    const auth = new authenticator(globalStorage);
    const UsersModel = new Users(globalStorage, auth);
    socket.on("user.get.infos", ({userId, userToken}) => {
        UsersModel.getUserInfos(userId, userToken)
            .then(response => {
                logger.add_log("General", "Request UserInfos Succeeded");
                socket.emit("user.getted.infos", response)
            })
            .catch(error => {
                logger.add_log("Error", `Request UserInfos Failed. details : ${JSON.stringify(error)}`);                
                socket.emit("error.fetch", error)
        });
    });
};

module.exports = usersSocket;
