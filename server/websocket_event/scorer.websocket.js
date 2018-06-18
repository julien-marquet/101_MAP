const usersSocket = (socket, globalStorage, i_queue, i_Oauth_authenticator, i_scorer) => {
    socket.on("get.scores", () => {
        i_scorer.getScore(socket);
    });
    socket.on("update.scores", () => {
        i_scorer.updateScores(socket);
    });
};

module.exports = usersSocket;
