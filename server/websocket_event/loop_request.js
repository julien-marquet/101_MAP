const   users_api = require("../api/Users.api");

const loop_request = (io, globalStorage,i_Oauth2_authenticator, i_users_api) => {
    setInterval(()=> {
        if (globalStorage.connectedUsers > 0)
        {
            i_users_api.getConnectedUsers(9, (result) => {
                if (result.success)
                    io.sockets.emit("connectedUsers", JSON.stringify(result.content));
                else
                    io.sockets.emit("connectedUsers", JSON.stringify({"error": true, "message": result.message}));
            });
        }
    }, 30000);
};

module.exports = loop_request;