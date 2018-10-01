import {all, takeEvery} from "redux-saga/effects";

import {GAME_LAUNCH} from "../actions/bomberman";

function launchGame(socketClient) {
    socketClient.emit("game.launch", {userToken: socketClient.socket.query.token});
}

function* flow(socketClient) {
    yield all([
        takeEvery(GAME_LAUNCH, launchGame, socketClient)
    ]);
}

export default flow;
