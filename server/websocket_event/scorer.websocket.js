const usersSocket = (socket, globalStorage, i_queue, i_Oauth_authenticator, i_scorer) => {
    socket.on("get.scores", () => {
        i_scorer.getScore(socket);
    });
    socket.on("add.scores", () => {
        i_scorer.addScores(socket);
    });
};

module.exports = usersSocket;
