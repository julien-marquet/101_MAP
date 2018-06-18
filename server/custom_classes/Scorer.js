class Scorer {
    constructor() {
        this.participant = [
            {
                id: 1,
                login: "BODO",
                score: 0
            },
            {
                id: 2,
                login: "MAX",
                score: 0
            }
        ];
    }
    getScore(socket) {
        console.log("emit")
        socket.emit("get.scores.success", this.participant);
    }
    
}

module.exports = Scorer;