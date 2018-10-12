import config from "../../../config/globalConfig";

function handleGameMoves(keyCode, position, move, fire, destroy, usersPositions) {
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
        if (r + 1 <= 5 && r + 1 >= 1) {
            if (keyCode === 37) {
                keyCode = 39;
            } else if (keyCode === 39) {
                keyCode = 37;
            }
        } else {
            if (keyCode === 38) {
                keyCode = 40;
            } else if (keyCode === 40) {
                keyCode = 38;
            }
        }
    }
    if (config.mapPositions["z1"][7][5] === undefined) {
        config.mapPositions["z1"][7].push("r8p6");
        config.mapPositions["z1"][10].push("r11p6");
        config.mapPositions["z1"][13].push("r14p6");
        config.mapPositions["z1"][2].push("r3p5");
        config.mapPositions["z2"][5].push("r6p6");
        config.mapPositions["z2"][2].push("r3p6");
        config.mapPositions["z3"][4].push("r5p4");
        config.mapPositions["z3"][3].push("r4p4");
        config.mapPositions["z4"][5].push("r6p6");
        config.mapPositions["z4"][2].push("r3p6");
    }
    const isArray = Array.isArray(usersPositions[position]);
    if (keyCode === 37) {
        const inExplosion = usersPositions[`z${z}r${r + 1}p${p}`] !== undefined &&
        (usersPositions[`z${z}r${r + 1}p${p}`].type === "explosion" ||
        (usersPositions[`z${z}r${r + 1}p${p}`].type !== undefined && 
        usersPositions[`z${z}r${r + 1}p${p}`].type.includes("flames")));
        if ((config.mapPositions[`z${z}`][r][p - 1] !== undefined &&
            usersPositions[`z${z}r${r + 1}p${p}`] === undefined) ||
            inExplosion) {
            if (inExplosion) {
                destroy(position);
            }
            if (config.teleporters[`z${z}r${r + 1}p${p}`] !== undefined) {
                return move({direction: "left", newPos: config.teleporters[`z${z}r${r + 1}p${p}`], oldPos: position, content: {
                    [config.teleporters[`z${z}r${r + 1}p${p}`]]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                    [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
                }});
            }
            move({direction: "left", newPos: `z${z}r${r + 1}p${p}`, oldPos: position, content: {
                [`z${z}r${r + 1}p${p}`]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
            }});
        }
    } else if (keyCode === 38) {
        const inExplosion = usersPositions[`z${z}r${r + 2}p${p + 1}`] !== undefined &&
        (usersPositions[`z${z}r${r + 2}p${p + 1}`].type === "explosion" ||
        (usersPositions[`z${z}r${r + 2}p${p + 1}`].type !== undefined && 
        usersPositions[`z${z}r${r + 2}p${p + 1}`].type.includes("flames")));
        if ((config.mapPositions[`z${z}`][r + 1] !== undefined &&
            config.mapPositions[`z${z}`][r + 1][p] !== undefined &&
            usersPositions[`z${z}r${r + 2}p${p + 1}`] === undefined) ||
            inExplosion) {
            if (inExplosion) {
                destroy(position);
            }
            if (config.teleporters[`z${z}r${r + 2}p${p + 1}`] !== undefined) {
                return move({direction: "up", newPos: config.teleporters[`z${z}r${r + 2}p${p + 1}`], oldPos: position, content: {
                    [config.teleporters[`z${z}r${r + 2}p${p + 1}`]]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                    [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
                }});
            }
            move({direction: "up", newPos: `z${z}r${r + 2}p${p + 1}`, oldPos: position, content: {
                [`z${z}r${r + 2}p${p + 1}`]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
            }});
        }
    } else if (keyCode === 39) {
        const inExplosion = usersPositions[`z${z}r${r + 1}p${p + 2}`] !== undefined &&
        (usersPositions[`z${z}r${r + 1}p${p + 2}`].type === "explosion" ||
        (usersPositions[`z${z}r${r + 1}p${p + 2}`].type !== undefined && 
        usersPositions[`z${z}r${r + 1}p${p + 2}`].type.includes("flames")));
        if ((config.mapPositions[`z${z}`][r][p + 1] !== undefined &&
            usersPositions[`z${z}r${r + 1}p${p + 2}`] === undefined) ||
            inExplosion) {
            if (inExplosion) {
                destroy(position);
            }
            if (config.teleporters[`z${z}r${r + 1}p${p + 2}`] !== undefined) {
                return move({direction: "right", newPos: config.teleporters[`z${z}r${r + 1}p${p + 2}`], oldPos: position, content: {
                    [config.teleporters[`z${z}r${r + 1}p${p + 2}`]]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                    [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
                }});
            }
            move({direction: "right", newPos: `z${z}r${r + 1}p${p + 2}`, oldPos: position, content: {
                [`z${z}r${r + 1}p${p + 2}`]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
            }});
        }
    } else if (keyCode === 40) {
        const inExplosion = usersPositions[`z${z}r${r}p${p + 1}`] !== undefined &&
        (usersPositions[`z${z}r${r}p${p + 1}`].type === "explosion" ||
        (usersPositions[`z${z}r${r}p${p + 1}`].type !== undefined && 
        usersPositions[`z${z}r${r}p${p + 1}`].type.includes("flames")));
        if ((config.mapPositions[`z${z}`][r - 1] !== undefined &&
            config.mapPositions[`z${z}`][r - 1][p] !== undefined &&
            usersPositions[`z${z}r${r}p${p + 1}`] === undefined) ||
            inExplosion) {
            if (inExplosion) {
                destroy(position);
            }
            if (config.teleporters[`z${z}r${r}p${p + 1}`] !== undefined) {
                return move({direction: "down", newPos: config.teleporters[`z${z}r${r}p${p + 1}`], oldPos: position, content: {
                    [config.teleporters[`z${z}r${r}p${p + 1}`]]: isArray ? usersPositions[position].filter(u => u.type === "player")[0] : usersPositions[position],
                    [position]: isArray ? usersPositions[position].filter(u => u.type !== "player")[0] : null
                }});
            }
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
