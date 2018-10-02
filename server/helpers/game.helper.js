const config = require("../config/globalConfig");

class Game {
    constructor(globalStorage) {
        this.storage = globalStorage;
    }

    setPos(userToken, oldPos, newPos) {
        this.storage.players[newPos] = userToken;
        delete this.storage.players[oldPos];
    }

    move({userToken, newPos, direction, oldPos}) {
        if (this.storage.players[oldPos] !== userToken) {
            // ERROR
        }
        const z = parseInt(newPos.split("z")[1].split("r")[0], 10);
        const r = parseInt(newPos.split("r")[1].split("p")[0], 10) - 1;
        const p = parseInt(newPos.split("p")[1], 10) - 1;
        if (direction === "left") {
            if (config.mapPositions[`z${z}`][r][p - 1] !== undefined &&
                this.storage.players[newPos] === undefined) {
                return this.setPos(userToken, oldPos, newPos);
            }
        } else if (direction === "up") {
            if (config.mapPositions[`z${z}`][r + 1] !== undefined &&
                config.mapPositions[`z${z}`][r + 1][p] !== undefined) {
                return this.setPos(userToken, oldPos, newPos);
            }
        } else if (direction === "right") {
            if (config.mapPositions[`z${z}`][r][p + 1] !== undefined) {
                return this.setPos(userToken, oldPos, newPos);
            }
        } else if (direction === "down") {
            if (config.mapPositions[`z${z}`][r - 1] !== undefined &&
                config.mapPositions[`z${z}`][r - 1][p] !== undefined) {
                return this.setPos(userToken, oldPos, newPos);
            }
        }
        // ERROR AND ROLLBACK
    }
}

module.exports = Game;
