import {all, fork} from "redux-saga/effects";

import sockets from "./sockets";

export default function* root(socketClient, dispatch) {
    yield all([
        fork(sockets, socketClient, dispatch)
    ]);
}