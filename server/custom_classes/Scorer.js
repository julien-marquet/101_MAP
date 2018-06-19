class Scorer {
    constructor() {
        this.rounds = [{
            id: 1,
            finished: false,
            title: "RoundTitle",
            description: "Alors voila c'est comme ca qu'on fait et ca commence maintenant !",
            scores: [{
                id: 1,
                score: 0
            }, {
                id: 2,
                score: 0
            }]
        }, {
            id : 2,
            finished: false,
            title: "RoundTitle2",
            description: "Alors voila c'est comme ca qu'on fait et ca commence maintenant !",
            scores: [{
                id: 1,
                score: 0
            }, {
                id: 2,
                score: 0
            }]
        }];
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
        this.finished = false;
        this.activeRound = null;
        this.nextRound = null;
        this.isStarted = false;
    }
    /*getWinner() {
        if (this.participants[0].score > this.participants[1].score) {
            return this.participants[0].id;
        } else if (this.participants[0].score < this.participants[1].score) {
            return this.participants[1].id;
        } else {
            return null;
        }
    }*/
    getFinishedRounds() {
        const fRounds = [];
        this.rounds.forEach(round => {
            if (round.finished === true)
                fRounds.push(round);
        });
        return fRounds;
    }
    getActiveRound() {
        for (let i = 0; i < this.rounds.length; i++) {
            if (this.rounds[i].id === this.activeRound) {
                return this.rounds[i];
            }
        }
        return null;
    }
    getGame(socket) {
        socket.emit("get.game.success", {
            finishedRounds: this.getFinishedRounds(),
            activeRound: this.getActiveRound(),
            participants: this.participants,
            nextRound: this.nextRound,
            isScorer: this.allowedScorer.includes(socket.userId),
            isStarted: this.isStarted,
        });
    }





    /*getScores(socket) {
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
    */
}

module.exports = Scorer;