require("dotenv").config({path: `${__dirname}/.env`});
const express = require("express"), 
    databaseConfig = require("./config/databaseConfig"),
    mongoose = require("mongoose"),
	{Client} = require("pg");
require("./models/index")();
const CoalitionsController = require("./controllers/Coalitions.controller");
const UsersController = require("./controllers/Users.controller");
const logger = require("./helpers/logger.helper"),  
    app = express(),
    server = require("http").Server(app),
    Storage = require("storage"),
    globalStorage = new Storage(),
    queue = new (require("./helpers/Queue.helper"))(globalStorage),
    Oauth = require("./helpers/OAuth.helper"),
    oauth = new Oauth(globalStorage, queue),
	psqlClient = new Client(),
    coalitionsController = new CoalitionsController(globalStorage, queue, oauth, psqlClient),
    usersController = new UsersController(globalStorage, queue, oauth, psqlClient),
    io = require("./websockets/io")(server, globalStorage, queue, oauth, coalitionsController, usersController),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    morgan = require("morgan"),
    tokenHelper = require("./helpers/tokenCache.helper"),
    stdinHelper = require("./helpers/stdin.helper");
const {clientPath, serverPort} = require("./config/globalConfig");

coalitionsController.updateScores();
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
globalStorage.set({psqlStatus: false});
const db = mongoose.connection;
const promise = psqlClient.connect()
	.then(() => {
		globalStorage.psqlStatus = true;
		logger.add_log({
			type: "General",
			description: "Connected to PSQL database"
		});
	})
	.catch(() => logger.add_log({
			type: "warning",
			description: "Couldn't connect to PSQL database"
		}));
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
	promise
		.then(() => {
            globalStorage.userInfos = {};
			server.listen(serverPort, () => {
	       		logger.add_log({
					type: "General", 
	   	         	description: "Succesfully launched server", 
	   	         	additionnal_infos: {
	   	            	Port: serverPort
	            	}
	        	});
			});
		})
		.catch(error => logger.add_log({
			type: "error",
			description: "Server couldn't be launched",
			additionnal_infos: {error}
		}));
});

process.on("SIGINT", () => tokenHelper.saveTokens(globalStorage));
process.on("SIGHUP", () => tokenHelper.saveTokens(globalStorage));
process.on("SIGTERM", () => tokenHelper.saveTokens(globalStorage));
process.stdin.setEncoding("utf8");
process.stdin.on("data", text => stdinHelper.treateCommand(text, io.sockets));
