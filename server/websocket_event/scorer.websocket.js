const usersSocket = (socket, globalStorage, i_queue, i_Oauth_authenticator, i_scorer) => {
    socket.on("get.game", () => {
        i_scorer.getGame(socket);
    });
    socket.on("start.game", () => {
        i_scorer.startGame(socket);
    });
    socket.on("reset.game", () => {
        i_scorer.resetGame(socket);
    });
    socket.on("end.game", () => {
        i_scorer.endGame(socket);
    });
    socket.on("reset.round", () => {
        i_scorer.resetRound(socket);
    });
    socket.on("update.round", (payload) => {
        i_scorer.updateRound(socket, payload);
    });
    socket.on("finish.round", (payload) => {
        i_scorer.finishRound(socket, payload);
    });
    socket.on("next.round", payload => {
        i_scorer.goNextRound(socket, payload);
    });
    socket.on("prev.round", () => {
        i_scorer.prevRound(socket);
    });
};

module.exports = usersSocket;
