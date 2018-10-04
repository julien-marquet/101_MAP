const config = require("../config/globalConfig");

class Game {
    constructor(globalStorage) {
        this.storage = globalStorage;
    }

    createMap() {
        this.storage.gameMap = {};
        Object.keys(this.storage.connected_users_array).map(key => {
            this.storage.gameMap[key] = {
                type: "wall",
                ...this.storage.connected_users_array[key]
            };
        });
    }

    setPos(userToken, oldPos, newPos) {
        this.storage.players[newPos] = this.storage.players[oldPos];
        delete this.storage.players[oldPos];
        if (Array.isArray(this.storage.gameMap[oldPos])) {
            this.storage.gameMap[newPos] = this.storage.gameMap[oldPos].filter(e => e.type === "player")[0];
            this.storage.gameMap[oldPos] = this.storage.gameMap[oldPos] = this.storage.gameMap[oldPos].filter(e => e.type !== "player")[0];
        } else {
            this.storage.gameMap[newPos] = this.storage.gameMap[oldPos];
            delete this.storage.gameMap[oldPos];
        }
        return null;
    }

    move({userToken, newPos, direction, oldPos}) {
        if (this.storage.players[oldPos] !== userToken) {
            // ERROR
        }
        const z = parseInt(oldPos.split("z")[1].split("r")[0], 10);
        const r = parseInt(oldPos.split("r")[1].split("p")[0], 10) - 1;
        const p = parseInt(oldPos.split("p")[1], 10) - 1;
        if (direction === "left") {
            if (config.mapPositions[`z${z}`][r][p - 1] !== undefined &&
                this.storage.gameMap[newPos] === undefined) {
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
        return {
            content: {
                [oldPos]: this.storage.gameMap[oldPos],
                [newPos]: this.storage.gameMap[newPos]
            }
        };
    }

    fire({userToken, pos}) {
        if (this.storage.players[pos] !== userToken ||
            Array.isArray(this.storage.gameMap[pos])) {
            return pos;
        }
        this.storage.gameMap[pos] = [this.storage.gameMap[pos], {type: "bomb", owner: userToken}];
        return null;
    }
}

module.exports = Game;
