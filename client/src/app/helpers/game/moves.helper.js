import config from "../../../config/globalConfig";

function handleGameMoves(keyCode, position, move) {
    const z = parseInt(position.split("z")[1].split("r")[0], 10);
    const r = parseInt(position.split("r")[1].split("p")[0], 10) - 1;
    const p = parseInt(position.split("p")[1], 10) - 1;
    if (keyCode === 37) {
        if (config.mapPositions[`z${z}`][r][p - 1] !== undefined) {
            move({new: `z${z}r${r + 1}p${p}`, old: position});
        }
    } else if (keyCode === 38) {
        if (config.mapPositions[`z${z}`][r - 1] !== undefined &&
            config.mapPositions[`z${z}`][r - 1][p] !== undefined) {
            move({new: `z${z}r${r + 2}p${p + 1}`, old: position});
        }
    } else if (keyCode === 39) {
        if (config.mapPositions[`z${z}`][r][p + 1] !== undefined) {
            move({new: `z${z}r${r + 1}p${p + 2}`, old: position});
        }
    } else if (keyCode === 40) {
        if (config.mapPositions[`z${z}`][r + 1] !== undefined &&
            config.mapPositions[`z${z}`][r + 1][p] !== undefined) {
            move({new: `z${z}r${r}p${p + 1}`, old: position});
        }
    }
}

export default handleGameMoves;
