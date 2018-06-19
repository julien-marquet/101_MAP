const scorerConfig = require("../config/scorerConfig");

class Scorer {
    constructor() {
        this.rounds = JSON.parse(JSON.stringify(scorerConfig.rounds));
        this.participants = JSON.parse(JSON.stringify(scorerConfig.participants));
        this.allowedScorer = JSON.parse(JSON.stringify(scorerConfig.allowedScorer));
        this.finished = scorerConfig.finished;
        this.activeRound = null;
        this.nextRound = null;
        this.isStarted = false;
        this.totalScores = 0;
        this.countDown = null;
    }
    getRoundWinner(round) {
        if (round.scores[0].score > round.scores[1].score) {
            return round.scores[0].id;
        } else  if (round.scores[0].score < round.scores[1].score) {
            return round.scores[1].id;
        } else {
            return null;
        }
    }
    selectNextRound() {
        if (this.activeRound === null) {
            this.activeRound = this.rounds[0].id;
        } else {
            let found = false;
            for (let i = 0; i < this.rounds.length; i++) {
                if (found) {
                    this.activeRound = this.rounds[i].id;
                    break ;
                } else if (this.rounds[i].id === this.activeRound.id)
                    found = true;
            }
            if (!found)
                this.activeRound = null;
        }
    }

    getActiveRound() {
        for (let i = 0; i < this.rounds.length; i++) {
            if (this.rounds[i].id === this.activeRound) {
                return {
                    ...this.rounds[i],
                    winner: this.getRoundWinner(this.rounds[i])
                };
            }
        }
        return null;
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
            activeRound: this.getActiveRound(),
            participants: this.participants,
            nextRound: this.nextRound,
            isScorer: this.allowedScorer.includes(socket.userId),
            isStarted: this.isStarted,
            totalScores: this.totalScores,
        });
    }

    startGame(socket) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("start.game.error");
        }
        this.isStarted = true;
        socket.emit("start.game.success", {
            finishedRounds: this.getFinishedRounds(),
            activeRound: this.getActiveRound(),
            participants: this.participants,
            nextRound: this.nextRound,
            isScorer: this.allowedScorer.includes(socket.userId),
            isStarted: this.isStarted,
            totalScores: this.totalScores,
        });
        socket.broadcast.emit("start.game.success", {
            finishedRounds: this.getFinishedRounds(),
            activeRound: this.getActiveRound(),
            participants: this.participants,
            nextRound: this.nextRound,
            isScorer: this.allowedScorer.includes(socket.userId),
            isStarted: this.isStarted,
            totalScores: this.totalScores,
        });
    }

    endGame(socket) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("end.game.error");
        }
        this.rounds = JSON.parse(JSON.stringify(scorerConfig.rounds));
        this.participants = JSON.parse(JSON.stringify(scorerConfig.participants));
        this.allowedScorer = JSON.parse(JSON.stringify(scorerConfig.allowedScorer));
        this.finished = scorerConfig.finished;
        this.activeRound = null;
        this.nextRound = null;
        this.isStarted = false;
        this.totalScores = 0;
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
                    activeRound: this.getActiveRound(),
                    nextRound: this.nextRound
                });
                socket.broadcast.emit("start.round.success", {
                    activeRound: this.getActiveRound(),
                    nextRound: this.nextRound
                });
            }, payload.countDown * 1000);
        }
    }
    updateRound(socket, payload) {
        if (!this.allowedScorer.includes(socket.userId) || !payload.target || !payload.type || !this.activeRound) {
            socket.emit("update.round.error", "error");
        }
        for (let i = 0; i < this.rounds.length; i++) {
            if (this.rounds[i].id === this.activeRound) {
                this.rounds[i].scores = this.rounds[i].scores.map(elem => {
                    if (elem.id === payload.target) {
                        if (payload.type === "ADD")
                            elem.score += 1;
                        else if (payload.type === "REMOVE")
                            elem.score = elem.score > 0 ? elem.score - 1 : 0;
                    }
                    return elem;
                });
                break ;
            }
        }
        socket.emit("update.round.success", {activeRound: this.getActiveRound()});
        socket.broadcast.emit("update.round.success", {activeRound: this.getActiveRound()});
    }
}

module.exports = Scorer;