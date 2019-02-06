import {takeEvery, all} from "redux-saga/effects";
import {
    USERS_GETTED,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED
} from "../actions/users";
import {COALITIONS_GETTED} from "../actions/coalitions";
import {TOAST_SHOW} from "../actions/toasts";
import {CONNECT_APP} from "../actions/globalState";
import {storeCookie} from "../helpers/cookies.helper";

function setupListeners(socketClient, dispatch) {
    socketClient.on("connectedUsers", data => {
        data = JSON.parse(data);
        if (data.error === undefined) {
            dispatch({type: USERS_GETTED, payload: {...data, coalitions: undefined}});
            dispatch({type: COALITIONS_GETTED, payload: {...data.coalitions}});
        } else {
            dispatch({
                type: TOAST_SHOW,
                payload: {
                    type: "error",
                    timeout: 3000,
                    message: "Couldn't get users from api",
                    action: null
                }
            });
        }
    });
    
    socketClient.on("authSuccess", data => {
        window.history.pushState("Home", "Home", "/");
        if (data && data.type === "code") {
            storeCookie("userToken", data.token);
            socketClient.socket.query.token = data.token;
        }
        dispatch({
            type: TOAST_SHOW, 
            payload: {		
                type: "success",		
                timeout: 3000,		
                message: "Socket connection established",		
                action: null
            }
        });
    });

    socketClient.on("error", err => {
        dispatch({
            type: TOAST_SHOW, 
            payload: {		
                type: "error",		
                timeout: 3000,		
                message: `Error : ${err}`,		
                action: null
            }
        });
    });

    socketClient.on("disconnect", () => {
        dispatch({
            type: TOAST_SHOW, 
            payload: {		
                type: "error",		
                timeout: 3000,		
                message: "Socket Connection lost",		
                action: null
            }
        });
    });

    socketClient.on("error.fetch", err => {
        dispatch({
            type: TOAST_SHOW, 
            payload: {		
                type: "error",		
                timeout: 3000,		
                message: `Socket Error : ${err}`,		
                action: null
            }
        });
        dispatch({type: USER_GET_METADATA_FAILED, payload: err});
    });

    socketClient.on("user.getted.infos", response => {
        if (response !== null && response.refresh_token) {
            storeCookie("userToken", response.refresh_token);
            socketClient.socket.query.token = response.refresh_token;
        }
        dispatch({type: USER_GET_METADATA_SUCCEEDED, payload: response.response});
    });
    socketClient.on("page.refresh", () => window.location.reload());
    socketClient.emit("users.get.all");
}

function* flow(socketClient, dispatch) {
    yield all([
        takeEvery(CONNECT_APP, setupListeners, socketClient, dispatch)
    ]);
}

export default flow;
