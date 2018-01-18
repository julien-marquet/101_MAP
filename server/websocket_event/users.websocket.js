const Users = require("../api/Users.api");
const authenticator = require('../OAuth2_authenticator');

const usersSocket = (socket, globalStorage) => {
    const auth = new authenticator(globalStorage);
    const UsersModel = new Users(globalStorage, auth);
    socket.on("user.get.infos", ({userId, userToken}) => {
        UsersModel.getUserInfos(userId, userToken)
            .then(response => socket.emit("user.getted.infos", response))
            .catch(error => socket.emit("error.fetch", error));
    });
};

module.exports = usersSocket;
