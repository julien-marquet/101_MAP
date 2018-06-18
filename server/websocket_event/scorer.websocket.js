const usersSocket = (socket, globalStorage, i_queue, i_Oauth_authenticator, i_scorer) => {
    socket.on("get.scores", () => {
        i_scorer.getScores(socket);
    });
    socket.on("update.scores", (payload) => {
        i_scorer.updateScores(socket, payload);
    });
};

module.exports = usersSocket;
