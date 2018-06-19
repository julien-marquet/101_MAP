import {all, takeLatest} from "redux-saga/effects";

import {GET_GAME, START_GAME, END_GAME} from "../actions/scores";

function getGame(socketClient) {
    socketClient.emit("get.game");
}

function startGame(socketClient) {
    socketClient.emit("start.game");
}

function endGame(socketClient) {
    socketClient.emit("end.game");
}

function* flow(socketClient) {
    yield all([
        takeLatest(GET_GAME, getGame, socketClient),
        takeLatest(START_GAME, startGame, socketClient),
        takeLatest(END_GAME, endGame, socketClient),
    ]);
}

export default flow;
