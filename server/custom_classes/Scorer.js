const scorerConfig = require("../config/scorerConfig");

class Scorer {
    constructor() {
        this.rounds = JSON.parse(JSON.stringify(scorerConfig.rounds));
        this.participants = JSON.parse(JSON.stringify(scorerConfig.participants));
        this.allowedScorer = JSON.parse(JSON.stringify(scorerConfig.allowedScorer));
        this.finished = false;
        this.activeRound = null;
        this.nextRound = null;
        this.isStarted = false;
        this.totalScores = JSON.parse(JSON.stringify(scorerConfig.totalScores));
        this.countDown = null;
    }

    markAsFinished(id) {
        if (id) {
            for (let i = 0; i < this.rounds.length; i++) {
                if (this.rounds[i].id === id) {
                    if (!this.rounds[i].finished) {
                        this.rounds[i].finished = true;
                        if (this.rounds[i].scores[0].score > this.rounds[i].scores[1].score) {
                            this.rounds[i].winner = this.rounds[i].scores[0].id;
                            this.totalScores[0].score += 1;
                        } else  if (this.rounds[i].scores[0].score < this.rounds[i].scores[1].score) {
                            this.rounds[i].winner = this.rounds[i].scores[1].id;
                            this.totalScores[1].score += 1;
                        } else {
                            this.rounds[i].winner = null;
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
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
                if (this.rounds[i].id === this.activeRound) {
                    found = i + 1;
                    break ;
                }
            }
            if (found < this.rounds.length)
                this.activeRound = this.rounds[found].id;
            else
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
            return ;
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
            return ;
        }
        this.rounds = JSON.parse(JSON.stringify(scorerConfig.rounds));
        this.participants = JSON.parse(JSON.stringify(scorerConfig.participants));
        this.allowedScorer = JSON.parse(JSON.stringify(scorerConfig.allowedScorer));
        this.finished = scorerConfig.finished;
        this.activeRound = null;
        this.nextRound = null;
        this.isStarted = false;
        this.totalScores = JSON.parse(JSON.stringify(scorerConfig.totalScores));
        socket.emit("end.game.success");
        socket.broadcast.emit("end.game.success");
    }
    goNextRound(socket, payload) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("next.round.error");
            return ;
        }
        clearTimeout(this.countDown);
        if (!(payload.countDown > 0))
            payload.countDown = 0;
        this.nextRound = Date.now() + payload.countDown * 1000;
        socket.emit("next.round.success", {nextRound: this.nextRound});
        socket.broadcast.emit("next.round.success" , {nextRound: this.nextRound});
        this.countDown = setTimeout(() => {
            this.markAsFinished(this.activeRound || null);
            this.selectNextRound();
            this.nextRound = null;
            socket.emit("start.round.success", {
                activeRound: this.getActiveRound(),
                finishedRounds: this.getFinishedRounds(),
                nextRound: this.nextRound,
                totalScores: this.totalScores
            });
            socket.broadcast.emit("start.round.success", {
                activeRound: this.getActiveRound(),
                finishedRounds: this.getFinishedRounds(),
                nextRound: this.nextRound,
                totalScores: this.totalScores
            });
        }, payload.countDown * 1000);
    }
    updateRound(socket, payload) {
        if (!this.allowedScorer.includes(socket.userId) || !payload.target || !payload.type || !this.activeRound) {
            socket.emit("update.round.error", "error");
            return ;
        }
        for (let i = 0; i < this.rounds.length; i++) {
            if (this.rounds[i].id === this.activeRound && this.rounds[i].finished === false) {
                this.rounds[i].scores = this.rounds[i].scores.map(elem => {
                    if (elem.id === payload.target) {
                        if (payload.type === "ADD")
                            elem.score += 1;
                        else if (payload.type === "REMOVE")
                            elem.score = elem.score > 0 ? elem.score - 1 : 0;
                    }
                    return elem;
                });
                socket.emit("update.round.success", {activeRound: this.getActiveRound()});
                socket.broadcast.emit("update.round.success", {activeRound: this.getActiveRound()});
                return ;
            }
        }
        socket.emit("update.round.error", "error");
    }
    finishRound(socket) {
        if (!this.allowedScorer.includes(socket.userId) || !this.activeRound) {
            socket.emit("finish.round.error", "error");
            return ;
        }
        if (this.markAsFinished(this.activeRound || null)) {
            socket.emit("finish.round.success", {totalScores: this.totalScores});
            socket.broadcast.emit("finish.round.success", {totalScores: this.totalScores});
        } else {
            socket.emit("finish.round.error", "error");
        }
    }
}

module.exports = Scorer;