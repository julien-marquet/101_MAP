const gameSocket = (socket, globalStorage, i_queue, i_OAuth2_authenticator, User) => {
    socket.on("game.launch", ({userToken}) => {
        User.getCurrentUser(userToken)
            .then(user => {
                socket.emit("whoami", user);
            })
            .catch(() => socket.emit("error", "Couldn't get player infos"));
    });
};

module.exports = gameSocket;
