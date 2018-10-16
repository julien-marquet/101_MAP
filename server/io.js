const fs = require("fs");
const	Users_api = require("./api/Users.api"),
    Oauth2_authenticator = require("./custom_classes/OAuth2_authenticator"),
    Queue = require("./custom_classes/Queue"),
    logger = require("./custom_modules/logger");

const socketFiles = [];
(function readDir(dir = __dirname) {
    fs.readdirSync(dir).map(file => {
        if (fs.lstatSync(`${dir}/${file}`).isDirectory())
            readDir(`${dir}/${file}`);
        else {
            if (file.includes(".websocket.js")) {
                socketFiles.push(require(`${dir}/${file}`));
            }
        }
    });
})();

const websocketHandler = (server, globalStorage) => {
    const	io = require("socket.io")(server);
    const   i_queue = new Queue(globalStorage),
        i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage, i_queue),
        i_users_api = new Users_api(globalStorage, i_Oauth2_authenticator, i_queue),
        Game = require("./helpers/game.helper"),
        GameHelper = new Game(globalStorage);

    require("./loopers/loop_request")(io, globalStorage, i_Oauth2_authenticator, i_users_api);

    globalStorage.connectedUsers = 0;

    io.use(require("./middlewares/Oauth_client_authentifier.middleware")(i_Oauth2_authenticator, globalStorage));
	
    io.on("connection", socket => {
        logger.add_log({
            type:"General", 
            description:"Socket Connection established"
        });
        socket.join("default");
        socket.emit("authSuccess", {
            type: socket.typeAuth,
            token: socket.userToken,
            userId: socket.userId,
            checked_at: socket.checked_at,
            expires_in: socket.expires_in
        });
        globalStorage.connectedUsers++;

        socket.on("disconnect", () => {
            logger.add_log({
                type:"General", 
                description:"Socket Connection Lost"
            });
            Object.keys(globalStorage.players).some(hostname => {
                if (globalStorage.players[hostname] === socket.userToken) {
                    delete globalStorage.players[hostname];
                    if (Array.isArray(globalStorage.gameMap[hostname])) {
                        globalStorage.gameMap[hostname].some(e => {
                            if (e.type !== "player") {
                                globalStorage.gameMap[hostname] = e;
                                return true;
                            }
                            return false;
                        });
                    }
                    socket.broadcast.to("game").emit("game.player.move", {[hostname]: null});
                }
                return globalStorage.players[hostname] !== socket.userToken;
            });
            globalStorage.connectedUsers--;
            Object.keys(globalStorage).map(key => {
                if (globalStorage[key] === socket.userToken) {
                    delete globalStorage[key];
                }
            });
        });
        socketFiles.map(fun => fun(io, socket, globalStorage, i_queue, i_Oauth2_authenticator, i_users_api, GameHelper));
    });
    return (io);
};
module.exports = websocketHandler;