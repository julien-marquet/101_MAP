const scorerConfig = require("../config/scorerConfig");

class Scorer {
    constructor() {
        this.rounds = scorerConfig.rounds;
        this.participants = scorerConfig.participants;
        this.allowedScorer = scorerConfig.allowedScorer;
        this.finished = scorerConfig.finished;
        this.activeRound = scorerConfig.activeRound;
        this.nextRound = scorerConfig.nextRound;
        this.isStarted = scorerConfig.isStarted;

        this.countDown = null;
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
    selectNextRound() {
        if (this.activeRound === null) {
            this.activeRound = this.rounds[0];
        } else {
            let found = false;
            for (let i = 0; i < this.rounds.length; i++) {
                if (found)
                    this.activeRound = this.rounds[i];
                else if (this.rounds[i].id === this.activeRound.id)
                    found = true;
            }
            if (!found)
                this.activeRound = null;
        }
    }

    getFinishedRounds() {
        const fRounds = [];
        this.rounds.forEach(round => {
            if (round.finished === true)
                fRounds.push(round);
        });
        return fRounds;
    }
    getGame(socket) {
        socket.emit("get.game.success", {
            finishedRounds: this.getFinishedRounds(),
            activeRound: this.activeRound,
            participants: this.participants,
            nextRound: this.nextRound,
            isScorer: this.allowedScorer.includes(socket.userId),
            isStarted: this.isStarted,
        });
    }

    startGame(socket) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("start.game.error");
        }
        this.isStarted = true;
        socket.emit("start.game.success");
        socket.broadcast.emit("start.game.success");
    }

    endGame(socket) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("end.game.error");
        }
        this.rounds = scorerConfig.rounds;
        this.participants = scorerConfig.participants;
        this.allowedScorer = scorerConfig.allowedScorer;
        this.finished = scorerConfig.finished;
        this.activeRound = scorerConfig.activeRound;
        this.nextRound = scorerConfig.nextRound;
        this.isStarted = scorerConfig.isStarted;
        socket.emit("end.game.success");
        socket.broadcast.emit("end.game.success");
    }
    goNextRound(socket, payload) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("next.round.error");
        }
        if (this.countDown)
            clearTimeout(this.countDown);
        if (payload.countDown > 0) {
            this.nextRound = Date.now() + payload.countDown * 1000;
            socket.emit("next.round.success", {nextRound: this.nextRound});
            socket.broadcast.emit("next.round.success" , {nextRound: this.nextRound});
            this.countDown = setTimeout(() => {
                this.selectNextRound();
                this.nextRound = null;
                socket.emit("start.round.success", {
                    activeRound: this.activeRound,
                    nextRound: this.nextRound
                });
                socket.broadcast.emit("start.round.success", {
                    activeRound: this.activeRound,
                    nextRound: this.nextRound
                });
            }, payload.countDown * 1000);
        }
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