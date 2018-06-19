import {all, takeLatest} from "redux-saga/effects";

import {GET_GAME, START_GAME} from "../actions/scores";

function getGame(socketClient) {
    socketClient.emit("get.game");
}

function startGame(socketClient) {
    socketClient.emit("start.game");
}

function* flow(socketClient) {
    yield all([
        takeLatest(GET_GAME, getGame, socketClient),
        takeLatest(START_GAME, startGame, socketClient)
    ]);
}

export default flow;
