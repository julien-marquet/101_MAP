const config = require("../config/globalConfig");

class Game {
    constructor(globalStorage) {
        this.storage = globalStorage;

        this.tp = {
            "z1r8p6": "z4r6p6",
            "z1r11p6": "z1r3p5",
            "z1r14p6": "z2r6p6",
            "z1r3p5": "z1r11p6",
            "z2r6p6": "z1r14p6",
            "z2r3p6": "z3r5p4",
            "z3r5p4": "z2r3p6",
            "z3r4p4": "z4r3p6",
            "z4r6p6": "z1r8p6",
            "z4r3p6": "z3r4p4"
        };
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

    checkExplosion(pos) {
        const z = parseInt(pos.split("z")[1].split("r")[0], 10);
        const r = parseInt(pos.split("r")[1].split("p")[0], 10);
        const p = parseInt(pos.split("p")[1], 10);
        if (config.mapPositions[`z${z}`][r - 1][p - 1] !== undefined &&
            this.storage.gameMap[pos] !== undefined &&
            this.storage.gameMap[pos].type === "bomb" &&
            this.storage.gameMap[pos].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r - 1][p - 2] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p - 1}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p - 1}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r}p${p - 1}`].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r - 1][p - 3] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p - 2}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p - 2}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r}p${p - 2}`].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r - 2] !== undefined &&
                config.mapPositions[`z${z}`][r - 2][p - 1] !== undefined &&
                this.storage.gameMap[`z${z}r${r - 1}p${p}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r - 1}p${p}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r - 1}p${p}`].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r - 3] !== undefined &&
                config.mapPositions[`z${z}`][r - 3][p - 1] !== undefined &&
                this.storage.gameMap[`z${z}r${r - 2}p${p}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r - 2}p${p}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r - 2}p${p}`].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r - 1][p] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p + 1}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p + 1}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r}p${p + 1}`].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r - 1][p + 1] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p + 2}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r}p${p + 2}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r}p${p + 2}`].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r] !== undefined &&
                config.mapPositions[`z${z}`][r][p - 1] !== undefined &&
                this.storage.gameMap[`z${z}r${r + 1}p${p}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r + 1}p${p}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r + 1}p${p}`].status === "exploded") {
            return true;
        } else if (config.mapPositions[`z${z}`][r + 1] &&
                config.mapPositions[`z${z}`][r + 1][p - 1] !== undefined &&
                this.storage.gameMap[`z${z}r${r + 2}p${p}`] !== undefined &&
                this.storage.gameMap[`z${z}r${r + 2}p${p}`].type === "bomb" &&
                this.storage.gameMap[`z${z}r${r + 2}p${p}`].status === "exploded") {
            return true;
        }
        return false;
    }

    setPos(userToken, oldPos, newPos) {
        if (this.checkExplosion(newPos) && !this.checkTp(newPos)) {
            this.deleteEntity(oldPos);
            return null;
        }
        this.storage.players[newPos] = this.storage.players[oldPos];
        delete this.storage.players[oldPos];
        if (Array.isArray(this.storage.gameMap[oldPos])) {
            this.storage.gameMap[newPos] = this.storage.gameMap[oldPos].filter(e => e.type === "player")[0];
            this.storage.gameMap[oldPos] = this.storage.gameMap[oldPos] = this.storage.gameMap[oldPos].filter(e => e.type !== "player")[0];
        } else {
            this.storage.gameMap[newPos] = this.storage.gameMap[oldPos];
            this.deleteEntity(oldPos);
        }
        return null;
    }

    deleteEntity(pos) {
        delete this.storage.gameMap[pos];
        if (this.storage.players[pos] !== undefined) {
            delete this.storage.players[pos];
        }
        return pos;
    }

    bombExplode(pos) {
        if (Array.isArray(this.storage.gameMap[pos])) {
            this.storage.gameMap[pos].some((e, key) => {
                const type = e.type;
                if (type === "bomb") {
                    this.storage.gameMap[pos][key].status = "exploded";
                }
                return type === "bomb";
            });
        } else {
            if (this.storage.gameMap[pos] === undefined) {
                return null;
            }
            this.storage.gameMap[pos].status = "exploded";
        }
        const z = parseInt(pos.split("z")[1].split("r")[0], 10);
        const r = parseInt(pos.split("r")[1].split("p")[0], 10);
        const p = parseInt(pos.split("p")[1], 10);
        const deleted = {};
        const exploded = {up: false, down: false, left: false, right: false};
        if (this.storage.gameMap[`z${z}r${r}p${p - 1}`] !== undefined) {
            exploded.left = true;
            deleted[this.deleteEntity(`z${z}r${r}p${p - 1}`)] = null;
        } if (this.storage.gameMap[`z${z}r${r}p${p - 2}`] !== undefined && !exploded.left) {
            deleted[this.deleteEntity(`z${z}r${r}p${p - 2}`)] = null;
        } if (this.storage.gameMap[`z${z}r${r}p${p + 1}`] !== undefined) {
            exploded.right = true;
            deleted[this.deleteEntity(`z${z}r${r}p${p + 1}`)] = null;
        } if (this.storage.gameMap[`z${z}r${r}p${p + 2}`] !== undefined && !exploded.right) {
            deleted[this.deleteEntity(`z${z}r${r}p${p + 2}`)] = null;
        } if (this.storage.gameMap[`z${z}r${r - 1}p${p}`] !== undefined) {
            exploded.up = true;
            deleted[this.deleteEntity(`z${z}r${r - 1}p${p}`)] = null;
        } if (this.storage.gameMap[`z${z}r${r - 2}p${p}`] !== undefined && !exploded.up) {
            deleted[this.deleteEntity(`z${z}r${r - 2}p${p}`)] = null;
        } if (this.storage.gameMap[`z${z}r${r + 1}p${p}`] !== undefined) {
            exploded.down = true;
            deleted[this.deleteEntity(`z${z}r${r + 1}p${p}`)] = null;
        } if (this.storage.gameMap[`z${z}r${r + 2}p${p}`] !== undefined && exploded.down) {
            deleted[this.deleteEntity(`z${z}r${r + 2}p${p}`)] = null;
        }
        return deleted;
    }

    checkTp(pos) {
        return Object.keys(this.tp).some(key => key === pos);
    }

    move({userToken, newPos, direction, oldPos}) {
        if (this.storage.players[oldPos] !== userToken) {
            // ERROR
        }
        if (this.checkTp(newPos)) {
            return this.setPos(userToken, oldPos, this.tp[newPos]);
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
        if (this.storage.gameMap[pos] === undefined) {
            this.storage.gameMap[pos] = {type: "bomb", owner: userToken};
        } else {
            this.storage.gameMap[pos] = [this.storage.gameMap[pos], {type: "bomb", owner: userToken}];
        }
        return null;
    }
}

module.exports = Game;
