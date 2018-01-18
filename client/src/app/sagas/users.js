import {all, takeLatest} from "redux-saga/effects";

import {USER_GET_METADATA} from "../actions/users";

function getUserMetadata(socketClient, {payload}) {
    socketClient.emit("user.get.infos", {userId: payload, userToken: socketClient.socket.query.token});
}

function* flow(socketClient) {
    yield all([
        takeLatest(USER_GET_METADATA, getUserMetadata, socketClient)
    ]);
}

export default flow;
