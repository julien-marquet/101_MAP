import {all, takeLatest} from "redux-saga/effects";

import {GET_GAME, START_GAME, END_GAME, NEXT_ROUND} from "../actions/scores";

function getGame(socketClient) {
    socketClient.emit("get.game");
}

function startGame(socketClient) {
    socketClient.emit("start.game");
}

function endGame(socketClient) {
    socketClient.emit("end.game");
}

function nextRound(socketClient, {payload}) {
    socketClient.emit("next.round", payload);
}

function* flow(socketClient) {
    yield all([
        takeLatest(GET_GAME, getGame, socketClient),
        takeLatest(START_GAME, startGame, socketClient),
        takeLatest(END_GAME, endGame, socketClient),
        takeLatest(NEXT_ROUND, nextRound, socketClient)
    ]);
}

export default flow;
