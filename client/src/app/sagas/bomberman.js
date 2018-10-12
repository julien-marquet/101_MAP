import {all, takeEvery, put} from "redux-saga/effects";

import {retrieveCookie} from "../helpers/cookies.helper";
import {
    MODE_SET_GAME,
    GAME_PLAYER_MOVE,
    GAME_PLAYER_CURRENT_MOVE,
    GAME_ENTITY_DELETE,
    GAME_PLAYER_CURRENT_FIRE,
    GAME_PLAYER_FIRE,
    GAME_BOMB_EXPLODE,
    GAME_ENTITIES_CREATE
} from "../actions/bomberman";

function launchGame(socketClient) {
    socketClient.emit("game.launch", {userToken: socketClient.socket.query.token});
}

function* sendMove(socketClient, {payload}) {
    Object.keys(payload.content).map(key => {
        if (payload.content[key] === null) {
            payload.content[key] = undefined;
        }
    });
    // yield put({type: GAME_ENTITY_DELETE, payload: toDelete});
    yield put({type: GAME_PLAYER_MOVE, payload: payload.content});
    if (!payload.isRollback) {
        socketClient.emit("game.player.move", {...payload, userToken: retrieveCookie("userToken")});
    }
}

function* sendFire(socketClient, {payload}) {
    yield put({type: GAME_PLAYER_FIRE, payload});
    socketClient.emit("game.player.fire", {pos: Object.keys(payload)[0], userToken: retrieveCookie("userToken")});
}

function* bombExplode({payload}) {
    // TODO Some test with races
    console.log("Payload BOMB EXPLODE: ", payload);
    yield put({type: GAME_ENTITY_DELETE, payload: payload.pos});
    yield put({type: GAME_ENTITIES_CREATE, payload: payload.entities});
}

function* flow(socketClient) {
    yield all([
        takeEvery(MODE_SET_GAME, launchGame, socketClient),
        takeEvery(GAME_PLAYER_CURRENT_MOVE, sendMove, socketClient),
        takeEvery(GAME_PLAYER_CURRENT_FIRE, sendFire, socketClient),
        takeEvery(GAME_BOMB_EXPLODE, bombExplode)
    ]);
}

export default flow;
