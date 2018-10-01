import {all, takeEvery} from "redux-saga/effects";

import {MODE_SET_GAME} from "../actions/bomberman";

function launchGame(socketClient) {
    socketClient.emit("game.launch", {userToken: socketClient.socket.query.token});
}

function* flow(socketClient) {
    yield all([
        takeEvery(MODE_SET_GAME, launchGame, socketClient)
    ]);
}

export default flow;
