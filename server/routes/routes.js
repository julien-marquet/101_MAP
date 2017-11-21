var express = require('express');
var router = express.Router();
var API_requests = require('../api/API_requests');
var globalState = require('../globalState');
const {clientPath} = require('../config/globalConfig');
var path = require('path');

router.get('/', function (req, res) {
    res.sendFile(path.normalize(path.join(`${__dirname}/../../${clientPath}/index.html`)));
});
router.get('/getConnectedUsers', getUsers);


function getUsers(req, res) {
    API_requests.getConnectedUsers(9, function (success) {
        if (success)
            res.json(JSON.stringify(globalState.connected_users));
        else
            res.json({"error": true, "message": "unknown error"});
    });
}

module.exports = router;