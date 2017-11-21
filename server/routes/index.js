const fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

const {clientPath} = require('../config/globalConfig');

router.get('/', function (req, res) {
    res.sendFile(path.normalize(path.join(`${__dirname}/../../${clientPath}/index.html`)));
});

fs.readdirSync(__dirname).map(file => {
    if (file !== "index.js") {
        require(`./${file}`)(router);
    }
});

module.exports = router;