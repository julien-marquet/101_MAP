class Scorer {
    constructor() {
        this.participants = [
            {
                id: 1,
                login: "BODO",
                score: 0,
            },
            {
                id: 2,
                login: "MAX",
                score: 0
            }
        ];
        this.allowedScorer = [
            31049
        ];
    }
    getWinner() {
        if (this.participants[0].score > this.participants[1].score) {
            return this.participants[0].id;
        } else if (this.participants[0].score < this.participants[1].score) {
            return this.participants[1].id;
        } else {
            return null;
        }
    }
    getScore(socket) {
        socket.emit("get.scores.success", {
            participants: this.participants,
            winner: this.getWinner(),
            isScorer: this.allowedScorer.includes(socket.userId)
        });
    }
    updateScore(socket) {
        console.log("update");
        if (this.allowedScorer.includes(socket.userId)) {
            socket.emit("update.scores.sucess", {
                participants: this.participants,
                winner: this.getWinner(),
                isScorer: this.allowedScorer.includes(socket.userId)
            });
            socket.broadcast.emit("update.scores", {
                participants: this.participants,
                winner: this.getWinner(),
                isScorer: this.allowedScorer.includes(socket.userId)
            });
        } else {
            socket.emit("update.scores.error", "not allowed");
        }
    }
    
}

module.exports = Scorer;