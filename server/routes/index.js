const   fs = require('fs'),
        path = require('path');

const   {clientPath} = require('../config/globalConfig');

const globalRouter = (router, globalStorage) => {
    router.get('/', function (req, res) {
        res.sendFile(path.normalize(path.join(`${__dirname}/../${clientPath}/entry.html`)));
    });
    (function readDir(dir = __dirname) {
        fs.readdirSync(dir).map(file => {
            if (fs.lstatSync(`${dir}/${file}`).isDirectory())
               readDir(`${dir}/${file}`);
            else if (file.includes('.route.js')) 
                require(`${dir}/${file}`)(router, globalStorage);
        });
    })();
    return (router);
};

module.exports = globalRouter;