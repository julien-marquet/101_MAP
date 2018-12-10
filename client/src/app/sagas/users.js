import {
    all,
    takeLatest,
    put
} from "redux-saga/effects";
import {delay} from "redux-saga";

import {
    USER_GET_METADATA,
    ACTIVE_USER_SWAP,
    USER_ACTIVE_SWAP,
    USER_CLEAR_ACTIVE
} from "../actions/users";

function getUserMetadata(socketClient, {payload}) {
    socketClient.emit("user.get.infos", {login: payload, userToken: socketClient.socket.query.token});
}

function* swapActiveUser({payload}) {
    yield put({type: USER_CLEAR_ACTIVE});
    yield delay(1);
    yield put({type: USER_ACTIVE_SWAP, payload});
}

function* flow(socketClient) {
    yield all([
        takeLatest(USER_GET_METADATA, getUserMetadata, socketClient),
        takeLatest(ACTIVE_USER_SWAP, swapActiveUser)
    ]);
}

export default flow;
