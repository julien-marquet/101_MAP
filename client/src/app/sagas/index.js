import {all, fork} from "redux-saga/effects";

import sockets from "./sockets";
import users from "./users";
import bomberman from "./bomberman";

export default function* root(socketClient, dispatch) {
    yield all([
        fork(sockets, socketClient, dispatch),
        fork(users, socketClient),
        fork(bomberman, socketClient)
    ]);
}
