const dotenv = require('dotenv').config(),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors');

const Oauth2_authenticator = require('./OAuth2_authenticator'),
    API_requests = require('./api/API_requests'),
    globalState = require('./globalState'),
    {clientPath, serverPort} = require('./config/globalConfig');
    var morgan = require('morgan');

var app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + clientPath));
app.use('/', [require('./routes/index')]);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.listen(serverPort, function () {
    console.log(`Server listening on port ${serverPort}`);
});
