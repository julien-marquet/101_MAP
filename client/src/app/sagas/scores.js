import {all, takeLatest} from "redux-saga/effects";

import {GET_GAME, START_GAME, END_GAME, NEXT_ROUND, UPDATE_ROUND, FINISH_ROUND, RESET_ROUND} from "../actions/scores";

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

function updateRound(socketClient, {payload}) {
    socketClient.emit("update.round", payload);
}

function finishRound(socketClient) {
    socketClient.emit("finish.round");
}

function resetRound(socketClient) {
    socketClient.emit("reset.round");
}

function* flow(socketClient) {
    yield all([
        takeLatest(GET_GAME, getGame, socketClient),
        takeLatest(START_GAME, startGame, socketClient),
        takeLatest(END_GAME, endGame, socketClient),
        takeLatest(NEXT_ROUND, nextRound, socketClient),
        takeLatest(UPDATE_ROUND, updateRound, socketClient),
        takeLatest(FINISH_ROUND, finishRound, socketClient),
        takeLatest(RESET_ROUND, resetRound, socketClient)
    ]);
}

export default flow;
