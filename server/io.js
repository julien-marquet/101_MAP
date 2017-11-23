const fs = require('fs');
var path = require('path');
const users_api = require("./api/Users.api");
const Oauth2_authenticator = require('./OAuth2_authenticator');

const websocketHandler = (server, globalStorage) => {
    io = require('socket.io')(server); 
       globalStorage.connectedUsers = 0;
       const i_Oauth2_authenticator = new Oauth2_authenticator(globalStorage);    
       const i_users_api = new users_api(globalStorage, i_Oauth2_authenticator);
   

    io.on('connection', (socket) => {
        globalStorage.connectedUsers++;

        if (globalStorage.connectedUsers > 0)
        {
            i_users_api.getConnectedUsers(9, (result) => {
                if (result.success)
                socket.emit("connectedUsers", JSON.stringify(result.content));
                else
                socket.emit("connectedUsers", JSON.stringify({"error": true, "message": result.message}));
            });
        }

        socket.on('disconnect', (data) => {
          globalStorage.connectedUsers--;
        })
        const websocket_event_handlers = require('./websocket_event/index')(socket, globalStorage);
      });
      const loop_request = require('./websocket_event/loop_request')(io, globalStorage, i_Oauth2_authenticator, i_users_api);
      
    
}
module.exports = websocketHandler;