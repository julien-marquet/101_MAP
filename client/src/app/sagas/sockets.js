import {takeEvery, all} from "redux-saga/effects";

import {USERS_GETTED} from "../actions/users";
import {CONNECT_APP} from "../actions/globalState";
import {storeCookie} from "../helpers/cookies.helper";

function setupListeners(socketClient, dispatch) {
    socketClient.on("connectedUsers", data => {
        dispatch({type: USERS_GETTED, payload: JSON.parse(data)});
    });
    
    socketClient.on("authSuccess", data => {
        window.history.pushState("Home", "Home", "/");
        if (data && data.type === "code")
            storeCookie("userToken", data.token);
    });
}

function* flow(socketClient, dispatch) {
    yield all([
        takeEvery(CONNECT_APP, setupListeners, socketClient, dispatch)
    ]);
}

export default flow;
