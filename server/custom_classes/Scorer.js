const scorerConfig = require("../config/scorerConfig");

class Scorer {
    constructor() {
        this.participants = this.buildParticipants();

        this.initialRounds = this.buildInitialRounds();
        this.initialTotal = this.buildInitialTotal();
        this.rounds = JSON.parse(JSON.stringify(this.initialRounds));
        this.allowedScorer = JSON.parse(JSON.stringify(scorerConfig.allowedScorer));
        this.finished = false;
        this.activeRound = null;
        this.nextRound = null;
        this.isStarted = false;
        this.totalScores = JSON.parse(JSON.stringify(this.initialTotal));
        this.countDown = null;
        this.nextFinish = null;
    }

    buildParticipants() {
        const participants = JSON.parse(JSON.stringify(scorerConfig.participants));
        const res = [];
        for (let j = 0; j < participants.length; j++) {
            res.push({
                login: participants[j],
                id: j + 1
            });
        }
        return res;
    }

    buildInitialTotal() {
        const total = [];
        for (let j = 0; j < this.participants.length; j++) {
            total.push({
                id: this.participants[j].id,
                score: 0,
            });
        }
        return total;
    }

    buildInitialRounds() {
        const rounds = JSON.parse(JSON.stringify(scorerConfig.rounds));
        for (let i = 0; i < rounds.length; i++) {
            rounds[i].id = i + 1;
            for (let j = 0; j < this.participants.length; j++) {
                rounds[i].scores.push({
                    id: this.participants[j].id,
                    score: 0,
                });
            }
        }
        return rounds;
    }

    updateGameStatus(socket) {
        const finished = this.getFinishedRounds();
        if (this.rounds.length === finished.length) {
            this.finished = true;
            socket.emit("finish.game.success");
            socket.broadcast.emit("finish.game.success");
        }
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
            nextFinish: this.nextFinish,
            isScorer: this.allowedScorer.includes(socket.userId),
            isStarted: this.isStarted,
            finished: this.finished,
            totalScores: [...this.totalScores],
            totalRounds: this.rounds.length
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
            nextFinish: this.nextFinish,
            isScorer: this.allowedScorer.includes(socket.userId),
            isStarted: this.isStarted,
            finished: this.finished,
            totalScores:  [...this.totalScores],
            totalRounds: this.rounds.length
        });
        socket.broadcast.emit("start.game.success", {
            finishedRounds: this.getFinishedRounds(),
            activeRound: this.getActiveRound(),
            participants: this.participants,
            nextRound: this.nextRound,
            nextFinish: this.nextFinish,
            isStarted: this.isStarted,
            finished: this.finished,
            totalScores:  [...this.totalScores],
            totalRounds: this.rounds.length
        });
    }

    endGame(socket) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("end.game.error");
            return ;
        }
        clearTimeout(this.countDown);
        this.nextRound = null;
        this.rounds = JSON.parse(JSON.stringify(this.initialRounds));
        this.allowedScorer = JSON.parse(JSON.stringify(scorerConfig.allowedScorer));
        this.finished = false;
        this.activeRound = null;
        this.isStarted = false;
        this.totalScores = JSON.parse(JSON.stringify(this.initialTotal));
        this.countDown = null;
        this.nextFinish = null;
        socket.emit("end.game.success");
        socket.broadcast.emit("end.game.success");
    }
    goNextRound(socket, payload) {
        if (!this.allowedScorer.includes(socket.userId)) {
            socket.emit("next.round.error");
            return ;
        }
        clearTimeout(this.countDown);
        this.nextRound = null;
        this.nextFinish = null;
        if (!(payload.countDown > 0))
            payload.countDown = 0;
        this.markAsFinished(this.activeRound || null);
        this.nextRound = Date.now() + payload.countDown * 1000;
        socket.emit("next.round.success", {nextRound: this.nextRound, totalScores: this.totalScores});
        socket.broadcast.emit("next.round.success" , {nextRound: this.nextRound, totalScores: this.totalScores});
        this.countDown = setTimeout(() => {
            this.selectNextRound();
            this.nextRound = null;
            socket.emit("start.round.success", {
                activeRound: this.getActiveRound(),
                finishedRounds: this.getFinishedRounds(),
                nextRound: this.nextRound,
                totalScores: [...this.totalScores]
            });
            socket.broadcast.emit("start.round.success", {
                activeRound: this.getActiveRound(),
                finishedRounds: this.getFinishedRounds(),
                nextRound: this.nextRound,
                totalScores:  [...this.totalScores]
            });
            this.updateGameStatus(socket);
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
    finishRound(socket, payload) {
        if (!this.allowedScorer.includes(socket.userId) || !this.activeRound || this.getActiveRound().finished) {
            socket.emit("finish.round.error", "error");
            return ;
        }
        clearTimeout(this.countDown);
        this.nextRound = null;
        this.nextFinish = null;
        
        if (!(payload.countDown > 0))
            payload.countDown = 0;
        this.nextFinish = Date.now() + payload.countDown * 1000;
        socket.emit("next.finish.success", {nextFinish: this.nextFinish});
        socket.broadcast.emit("next.finish.success" , {nextFinish: this.nextFinish});
        
        this.countDown = setTimeout(() => {
            if (this.markAsFinished(this.activeRound || null)) {
                this.nextFinish = null;
                socket.emit("finish.round.success", {finishedRounds:this.getFinishedRounds(), totalScores:  [...this.totalScores]});
                socket.broadcast.emit("finish.round.success", {finishedRounds:this.getFinishedRounds(), totalScores:  [...this.totalScores]});
                this.updateGameStatus(socket);
            } else {
                socket.emit("finish.round.error", "error");
            }
        }, payload.countDown * 1000);
    }
    resetRound(socket) {
        if (!this.allowedScorer.includes(socket.userId) || !this.activeRound) {
            socket.emit("reset.round.error", "error");
            return ;
        }
        clearTimeout(this.countDown);
        this.nextRound = null;
        this.nextFinish = null;
        for (let i = 0; i < this.rounds.length; i++) {
            if (this.rounds[i].id === this.activeRound) {
                if (this.rounds[i].finished === false) {
                    this.rounds[i] = JSON.parse(JSON.stringify(this.initialRounds[i]));
                } else {
                    const winner = this.getRoundWinner(this.rounds[i]);
                    if (winner !== null) {
                        this.totalScores[winner - 1].score -= 1;
                    }
                    this.rounds[i] = JSON.parse(JSON.stringify(this.initialRounds[i]));
                }
                if (this.finished)
                    this.finished = false;
                socket.emit("reset.round.success", {totalScores:  [...this.totalScores],
                    finishedRounds: this.getFinishedRounds(),
                    activeRound: this.getActiveRound(),
                    finished: this.finished,
                });
                socket.broadcast.emit("reset.round.success", {totalScores:  [...this.totalScores],
                    finishedRounds: this.getFinishedRounds(),
                    activeRound: this.getActiveRound(),
                    finished: this.finished,
                });
            }
        }
    }
    prevRound(socket) {
        if (!this.allowedScorer.includes(socket.userId) || !this.activeRound || this.activeRound <= 1) {
            socket.emit("prev.round.error", "error");
            return ;
        }
        clearTimeout(this.countDown);
        this.nextRound = null;
        this.nextFinish = null;
        for (let i = 1; i < this.rounds.length; i++) {
            if (this.rounds[i].id === this.activeRound) {
                if (this.rounds[i].finished === false) {
                    this.rounds[i] = JSON.parse(JSON.stringify(this.initialRounds[i]));
                    const winner2 = this.getRoundWinner(this.rounds[i - 1]);
                    if (winner2 !== null) {
                        this.totalScores[winner2 - 1].score -= 1;
                    }
                    this.rounds[i - 1] = JSON.parse(JSON.stringify(this.initialRounds[i - 1]));
                }  else {
                    const winner = this.getRoundWinner(this.rounds[i]);
                    if (winner !== null) {
                        this.totalScores[winner - 1].score -= 1;
                    }
                    const winner2 = this.getRoundWinner(this.rounds[i - 1]);
                    if (winner2 !== null) {
                        this.totalScores[winner2 - 1].score -= 1;
                    }
                    this.rounds[i] = JSON.parse(JSON.stringify(this.initialRounds[i]));
                    this.rounds[i - 1] = JSON.parse(JSON.stringify(this.initialRounds[i - 1]));
                }
                if (this.finished)
                    this.finished = false;
                this.activeRound -= 1;
                socket.emit("prev.round.success", {totalScores:  [...this.totalScores],
                    finishedRounds: this.getFinishedRounds(),
                    activeRound: this.getActiveRound(),
                    finished: this.finished,
                });
                socket.broadcast.emit("prev.round.success", {totalScores:  [...this.totalScores],
                    finishedRounds: this.getFinishedRounds(),
                    activeRound: this.getActiveRound(),
                    finished: this.finished,
                });
            }
        }
    }
}

module.exports = Scorer;