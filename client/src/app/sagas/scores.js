import {all, takeLatest} from "redux-saga/effects";

import {GET_SCORES, UPDATE_SCORES} from "../actions/scores";

function getScores(socketClient) {
    console.log("get")
    socketClient.emit("get.scores");
}

function updateScores(socketClient, {payload}) {
    console.log("update");
    socketClient.emit("update.scores", payload);
}

function* flow(socketClient) {
    yield all([
        takeLatest(GET_SCORES, getScores, socketClient),
        takeLatest(UPDATE_SCORES, updateScores, socketClient)
    ]);
}

export default flow;
