require("dotenv").config();
const express = require("express"), 
    databaseConfig = require("./config/databaseConfig"),
    mongoose = require("mongoose");
require("./models/index")();
const logger = require("./custom_modules/logger"),
    app = express(),
    server = require("http").Server(app),
    Storage = require("storage"),
    globalStorage = new Storage(),
    io = require("./io")(server, globalStorage),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    morgan = require("morgan"),
    tokenHelper = require("./helpers/tokenCache.helper"),
    stdinHelper = require("./helpers/stdin.helper");
const {clientPath, serverPort} = require("./config/globalConfig");

globalStorage.players = {};
globalStorage.gameMap = null;
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + clientPath));
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
mongoose.connect(databaseConfig.db).then(() => {}, (err) => {
    logger.add_log({
        type: "Error", 
        description: "DB error", 
        additionnal_infos: {
            Error :err
        }
    });
});
const db = mongoose.connection;
db.on("error", (err) => {
    logger.add_log({
        type: "Error", 
        description: "DB error", 
        additionnal_infos: {
            Error :err
        }
    });
});
db.once("open", () => {
    logger.add_log({
        type: "General", 
        description: "Succesfully Connected to database"
    });
    server.listen(serverPort, () => {
        logger.add_log({type: "General", 
            description: "Succesfully launched server", 
            additionnal_infos: {
                Port: serverPort
            }
        });
    });
});

process.on("SIGINT", () => tokenHelper.saveTokens(globalStorage));
process.on("SIGHUP", () => tokenHelper.saveTokens(globalStorage));
process.on("SIGTERM", () => tokenHelper.saveTokens(globalStorage));
process.stdin.setEncoding("utf8");
process.stdin.on("data", text => stdinHelper.treateCommand(text, io.sockets));
