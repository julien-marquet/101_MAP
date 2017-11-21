const fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

const {clientPath} = require('../config/globalConfig');

router.get('/', function (req, res) {
    res.sendFile(path.normalize(path.join(`${__dirname}/../../${clientPath}/index.html`)));
});

(function readDir(dir = __dirname) {
    fs.readdirSync(dir).map(file => {
        if (fs.lstatSync(`${dir}/${file}`).isDirectory())
            readDir(`${dir}/${file}`);
        else {
            if (file.includes('.route.js')) {
                require(`${dir}/${file}`)(router);
            }
        }
    });
})();

module.exports = router;