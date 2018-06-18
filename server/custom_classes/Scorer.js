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
    getScores(socket) {
        socket.emit("get.scores.success", {
            participants: this.participants,
            winner: this.getWinner(),
            isScorer: this.allowedScorer.includes(socket.userId)
        });
    }
    updateScores(socket, payload) {
        if (this.allowedScorer.includes(socket.userId) && payload.target && payload.type) {
            this.participants = this.participants.map(participant => {
                if (participant.id === payload.target) {
                    if (payload.type === "ADD")
                        participant.score += 1;
                    else if (payload.type === "REMOVE")
                        participant.score = participant.score > 0 ? participant.score - 1 : 0;
                    else if (payload.type === "RESET")
                        participant.score = 0;
                }
                return participant;
            });
            socket.emit("update.scores.success", {
                participants: this.participants,
                winner: this.getWinner(),
                isScorer: this.allowedScorer.includes(socket.userId)
            });
            socket.broadcast.emit("update.scores.success", {
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