import {all, takeLatest} from "redux-saga/effects";

import {GET_GAME} from "../actions/scores";

function getGame(socketClient) {
    console.log("get")
    socketClient.emit("get.game");
}

function* flow(socketClient) {
    yield all([
        takeLatest(GET_GAME, getGame, socketClient),
    ]);
}

export default flow;
