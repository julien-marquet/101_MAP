const gameSocket = (io, socket, globalStorage, i_queue, i_OAuth2_authenticator, User, Game) => {
    socket.on("game.launch", ({userToken}) => {
        socket.join("game");
        socket.leave("default");
        if (globalStorage.gameMap === null) {
            Game.createMap();
        }
        User.getCurrentUser(userToken)
            .then(user => {
                Object.keys(globalStorage.connected_users_array).some(key => {
                    const bool = globalStorage.connected_users_array[key].user.id === user.id;
                    if (bool) {
                        user.hostname = key;
                    }
                    return bool;
                });
                globalStorage.players[user.hostname] = userToken;
                globalStorage.gameMap[user.hostname] = {
                    type: "player",
                    ...globalStorage.connected_users_array[user.hostname]
                };
                socket.emit("whoami", user);
                io.sockets.emit("connectedUsers", JSON.stringify({array: globalStorage.gameMap}));
                // socket.broadcast.to("game").emit("game.player.move", {oldPos: user.hostname, newPos: user.hostname});
            })
            .catch(() => socket.emit("error", "Couldn't get player infos"));
    });

    socket.on("game.player.move", payload => {
        const result = Game.move(payload);
        if (result !== null) {
            result.isRollback = true;
            socket.emit("game.player.move", result);
        } else {
            socket.broadcast.to("game").emit("game.player.move", payload);
        }
    });
};

module.exports = gameSocket;
