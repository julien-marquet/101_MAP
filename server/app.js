const express = require('express'),
    app = express();
    server = require('http').Server(app),
    Storage = require('storage'),
    globalStorage = new Storage(),
    io = require('./io')(server, globalStorage),
    env = require('dotenv').config(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    morgan = require('morgan'),    
    router = express.Router();
    

const {clientPath, serverPort} = require('./config/globalConfig');
    
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + clientPath));
app.use('/', [require('./routes/index')(router, globalStorage)]);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




server.listen(serverPort, function () {
    console.log(`Server listening on port ${serverPort}`);
});
