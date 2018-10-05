import config from "../../../config/globalConfig";

function handleGameMoves(keyCode, position, move, fire, usersPositions) {
    const z = parseInt(position.split("z")[1].split("r")[0], 10);
    const r = parseInt(position.split("r")[1].split("p")[0], 10) - 1;
    const p = parseInt(position.split("p")[1], 10) - 1;
    if (z === 4) {
        if (keyCode === 37) {
            keyCode = 39;
        } else if (keyCode === 39) {
            keyCode = 37;
        }
    } else if (z === 3) {
        if (keyCode === 37) {
            keyCode = 38;
        } else if (keyCode === 38) {
            keyCode = 37;
        } else if (keyCode === 39) {
            keyCode = 40;
        } else if (keyCode === 40) {
            keyCode = 39;
        }
    } else if (z === 1) {
        if (keyCode === 38) {
            keyCode = 40;
        } else if (keyCode === 40) {
            keyCode = 38;
        }
    }
    const isArray = Array.isArray(usersPositions[position]);
    if (keyCode === 37) {
        if (config.mapPositions[`z${z}`][r][p - 1] !== undefined &&
            usersPositions[`z${z}r${r + 1}p${p}`] === undefined) {
            move({direction: "left", newPos: `z${z}r${r + 1}p${p}`, oldPos: position, content: {
                [`z${z}r${r + 1}p${p}`]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
            }});
        }
    } else if (keyCode === 38) {
        if (config.mapPositions[`z${z}`][r + 1] !== undefined &&
            config.mapPositions[`z${z}`][r + 1][p] !== undefined &&
            usersPositions[`z${z}r${r + 2}p${p + 1}`] === undefined) {
            move({direction: "up", newPos: `z${z}r${r + 2}p${p + 1}`, oldPos: position, content: {
                [`z${z}r${r + 2}p${p + 1}`]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
            }});
        }
    } else if (keyCode === 39) {
        if (config.mapPositions[`z${z}`][r][p + 1] !== undefined &&
        usersPositions[`z${z}r${r + 1}p${p + 2}`] === undefined) {
            move({direction: "right", newPos: `z${z}r${r + 1}p${p + 2}`, oldPos: position, content: {
                [`z${z}r${r + 1}p${p + 2}`]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
            }});
        }
    } else if (keyCode === 40) {
        if (config.mapPositions[`z${z}`][r - 1] !== undefined &&
            config.mapPositions[`z${z}`][r - 1][p] !== undefined &&
            usersPositions[`z${z}r${r}p${p + 1}`] === undefined) {
            move({direction: "down", newPos: `z${z}r${r}p${p + 1}`, oldPos: position, content: {
                [`z${z}r${r}p${p + 1}`]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
            }});
        }
    } else if (keyCode === 32) {
        fire({[position]: [usersPositions[position], {type: "bomb"}]});
    }
}

export default handleGameMoves;
