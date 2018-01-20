const fs = require("fs");

const modelLoader = () => {
    (function readDir(dir = __dirname) {
        fs.readdirSync(dir).map(file => {
            if (fs.lstatSync(`${dir}/${file}`).isDirectory())
                readDir(`${dir}/${file}`);
            else {
                if (file.includes(".model.js"))
                    require(`${dir}/${file}`);
            }
        });
    })();
};

module.exports = modelLoader;