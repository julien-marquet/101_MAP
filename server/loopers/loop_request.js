const logger = require("../helpers/logger.helper");
const {connectedUsers_loopRate} = require("../config/globalConfig");

const loop_request = (io, globalStorage,i_Oauth2_authenticator, i_users_api, coalitionsController, usersController) => {
    setInterval(()=> {
        coalitionsController.updateScores()
            .then(() => {
                if (globalStorage.connectedUsers > 0) {
                    logger.add_log({
                        type:"General", 
                        description:"Starting periodic request connectedUsers"
                    });            
                    usersController.getConnectedUsers()
						.then(result => {
                        	io.sockets.emit("connectedUsers", JSON.stringify(result));
                        	logger.add_log({
                            	type:"General", 
                            	description:"Periodic request connectedUsers Succeeded"
                        	});                                
                    	})
						.catch(err => {
                        	io.sockets.emit("connectedUsers", JSON.stringify({"error": true, "message": err}));
                        	logger.add_log({
                            	type:"Error", 
                            	description:"Periodic request connectedUsers Failed", 
                            	additional_infos: {
                                	Error: err
                            	}
							});      
                    	});
                }
            });
    }, connectedUsers_loopRate * 1000);
};

module.exports = loop_request;
