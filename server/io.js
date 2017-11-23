const fs = require('fs');
var path = require('path');

const websocketHandler = (server, globalStorage) => {
    io = require('socket.io')(server); 


    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
          console.log(data);
        });
        const websocket_event_handlers = require('./websocket_event/index')(socket, globalStorage);
      });

    
}
module.exports = websocketHandler;