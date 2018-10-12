const gameSocket = (io, socket, globalStorage, i_queue, i_OAuth2_authenticator, User, Game) => {
    socket.on("game.launch", ({userToken}) => {
        console.log("Player joined the game");
        if (Object.keys(globalStorage.players).filter(key=> globalStorage.players[key]).length > 0) {
            // ERROR
            console.error("game.websocket.js line 6 ERROOOOOORR");
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
                (function joinGame() {
                    if (globalStorage.gameMap[user.hostname] === undefined ||
                        globalStorage.gameMap[user.hostname].user.id === user.id) {
                        globalStorage.players[user.hostname] = userToken;
                        globalStorage.gameMap[user.hostname] = {
                            type: "player",
                            ...globalStorage.connected_users_array[user.hostname]
                        };
                        console.log("Emitting users");
                        socket.emit("whoami", user);
                        io.sockets.emit("connectedUsers", JSON.stringify({array: globalStorage.gameMap}));
                    } else {
                        setTimeout(joinGame, 500);
                    }
                })();
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
            socket.emit("game.player.move", {
                isRollback: true,
                newPos: payload.oldPos,
                content: {
                    [payload.newPos]: globalStorage.gameMap[payload.newPos] || null,
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
                    if (Object.keys(result).length > 0) {
                        socket.broadcast.to("game").emit("game.entities.delete", result);
                    }
                    setTimeout(() => Game.deleteEntity(payload.pos), 1280);
                }
            }, 1650);
        }
    });
};

module.exports = gameSocket;
