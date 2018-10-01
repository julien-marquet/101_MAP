const gameSocket = (socket, globalStorage, i_queue, i_OAuth2_authenticator, User) => {
    socket.on("game.launch", ({userToken}) => {
        User.getCurrentUser(userToken)
            .then(user => {
                Object.keys(globalStorage.connected_users_array).some(key => {
                    console.log(globalStorage.connected_users_array[key]);
                    const bool = globalStorage.connected_users_array[key].user.id === user.id;
                    if (bool) {
                        console.log("Hostname setted");
                        user.hostname = key;
                    }
                    return bool;
                });
                console.log("Emitting...");
                socket.emit("whoami", user);
            })
            .catch(() => socket.emit("error", "Couldn't get player infos"));
    });
};

module.exports = gameSocket;
