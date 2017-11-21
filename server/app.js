const dotenv = require('dotenv').config(),
    express = require('express'),
    bodyParser = require('body-parser'),
    Oauth2_authenticator = require('./OAuth2_authenticator'),
    API_requests = require('./API_requests'),
    globalState = require('./globalState');

var app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + process.env.CLIENT_PATH));
app.use('/', [require('./routes')]);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.listen(process.env.PORT, function () {
    console.log("server listening on port " + process.env.PORT);
});



