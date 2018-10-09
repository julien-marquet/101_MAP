const gameSocket = (io, socket, globalStorage, i_queue, i_OAuth2_authenticator, User, Game) => {
    socket.on("game.launch", ({userToken}) => {
        console.log("Player joined the game");
        if (Object.keys(globalStorage.players).filter(key=> globalStorage.players[key]).length > 0) {
            // ERROR
            // return ;
        }
        socket.join("game");
        socket.leave("default");
        if (globalStorage.gameMap === null) {
            Game.createMap();
            console.log("Created map...");
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
                console.log("Emitting users");
                socket.emit("whoami", user);
                io.sockets.emit("connectedUsers", JSON.stringify({array: globalStorage.gameMap}));
                // socket.broadcast.to("game").emit("game.player.move", {oldPos: user.hostname, newPos: user.hostname});
            })
            .catch(error => {
                console.error("An error occured", error);
                socket.emit("error", "Couldn't get player infos");
            });
    });

    socket.on("game.player.move", payload => {
        // Validator for params
        const result = Game.move(payload);
        if (result !== null) {
            payload.isRollback = true;
            payload.newPos = payload.oldPos;
            socket.emit("game.player.move", {
                isRollback: true,
                newPos: payload.oldPos,
                content: {
                    [payload.newPos]: null,
                    [payload.oldPos]: {
                        ...globalStorage.gameMap[payload.oldPos],
                        userToken: undefined
                    }
                }
            });
        } else {
            payload.content[payload.oldPos] = globalStorage.gameMap[payload.oldPos] || null;
            socket.broadcast.to("game").emit("game.player.move", payload.content);
        }
    });

    socket.on("game.player.fire", payload => {
        // Validator for params
        // Check if pos is a real pos
        const result = Game.fire(payload);
        if (result !== null) {
            result.isRollback = true;
            socket.emit("game.entity.remove", result);
        } else {
            const newPos = globalStorage.gameMap[payload.pos];
            if (Array.isArray(newPos)) {
                newPos.some((e, key) => {
                    if (e.type === "bomb") {
                        delete newPos[key].owner;
                    }
                    return e.type === "bomb";
                });
            } else {
                delete newPos.owner;
            }
            socket.broadcast.to("game").emit("game.player.fire", {[payload.pos]: newPos});
            setTimeout(() => {
                const result = Game.bombExplode(payload.pos);
                if (result !== null) {
                    setTimeout(() => Game.deleteEntity(payload.pos), 2000);
                }
            }, 1000);
        }
    });
};

module.exports = gameSocket;
