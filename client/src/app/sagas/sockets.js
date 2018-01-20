import {takeEvery, all} from "redux-saga/effects";

import {
    USERS_GETTED,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED
} from "../actions/users";
import {CONNECT_APP} from "../actions/globalState";
import {storeCookie} from "../helpers/cookies.helper";

function setupListeners(socketClient, dispatch) {
    socketClient.on("connectedUsers", data => {
        dispatch({type: USERS_GETTED, payload: JSON.parse(data)});
    });
    
    socketClient.on("authSuccess", data => {
        window.history.pushState("Home", "Home", "/");
        if (data && data.type === "code") {
            storeCookie("userToken", data.token);
            socketClient.socket.query.token = data.token;
        }
    });

    socketClient.on("error", err => {
        console.error(`Socket Error : ${JSON.stringify(err)}`);
    });

    socketClient.on("error.fetch", err => {
        console.error(`Socket Error : ${JSON.stringify(err)}`);
        dispatch({type: USER_GET_METADATA_FAILED, payload: err});
    });

    socketClient.on("user.getted.infos", response => {
        dispatch({type: USER_GET_METADATA_SUCCEEDED, payload: response});
    });
}

function* flow(socketClient, dispatch) {
    yield all([
        takeEvery(CONNECT_APP, setupListeners, socketClient, dispatch)
    ]);
}

export default flow;
