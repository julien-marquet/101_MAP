const express = require('express'),
    env = require('dotenv').config(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    morgan = require('morgan'),    
    Storage = require('storage'),
    router = express.Router(),
    globalStorage = new Storage();

const {clientPath, serverPort} = require('./config/globalConfig');
    
var app = express();

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
app.listen(serverPort, function () {
    console.log(`Server listening on port ${serverPort}`);
});
