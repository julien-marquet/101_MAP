import {all, takeLatest} from "redux-saga/effects";

import {GET_SCORES} from "../actions/scores";

function getScores(socketClient) {
    console.log("get")
    socketClient.emit("get.scores");
}

function* flow(socketClient) {
    yield all([
        takeLatest(GET_SCORES, getScores, socketClient)
    ]);
}

export default flow;
