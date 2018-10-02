const gameSocket = (socket, globalStorage, i_queue, i_OAuth2_authenticator, User, Game) => {
    socket.on("game.launch", ({userToken}) => {
        User.getCurrentUser(userToken)
            .then(user => {
                Object.keys(globalStorage.connected_users_array).some(key => {
                    const bool = globalStorage.connected_users_array[key].user.id === user.id;
                    if (bool) {
                        user.hostname = key;
                    }
                    return bool;
                });
                globalStorage.players[user.hostname] = user.hostname;
                socket.emit("whoami", user);
            })
            .catch(() => socket.emit("error", "Couldn't get player infos"));
    });

    socket.on("game.player.move", payload => Game.move(payload));
};

module.exports = gameSocket;
