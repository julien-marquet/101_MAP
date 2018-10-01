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
        i_users_api = new Users_api(globalStorage, i_Oauth2_authenticator, i_queue);

    require("./loopers/loop_request")(io, globalStorage, i_Oauth2_authenticator, i_users_api);

    globalStorage.connectedUsers = 0;

    io.use(require("./middlewares/Oauth_client_authentifier.middleware")(i_Oauth2_authenticator, globalStorage));
	
    io.on("connection", socket => {
        logger.add_log({
            type:"General", 
            description:"Socket Connection established"
        });		
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
            globalStorage.connectedUsers--;
        });
        socketFiles.map(fun => fun(socket, globalStorage, i_queue, i_Oauth2_authenticator, i_users_api));
    });
    return (io);
};
module.exports = websocketHandler;