import {takeEvery, all} from "redux-saga/effects";
import {
    USERS_GETTED,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED
} from "../actions/users";
import {TOAST_SHOW} from "../actions/toasts";
import {CONNECT_APP} from "../actions/globalState";
import {GET_GAME_SUCCESS, START_GAME_SUCCESS, END_GAME_SUCCESS, NEXT_ROUND_SUCCESS, START_ROUND_SUCCESS, UPDATE_ROUND_SUCCESS, FINISH_ROUND_SUCCESS, FINISH_GAME_SUCCESS, RESET_ROUND_SUCCESS, PREV_ROUND_SUCCESS, NEXT_FINISH_SUCCESS} from "../actions/scores";
import {storeCookie} from "../helpers/cookies.helper";

function setupListeners(socketClient, dispatch) {

    socketClient.on("get.game.success", data => {
        dispatch({type: GET_GAME_SUCCESS, payload: data});
    });
    socketClient.on("start.game.success", data => {
        dispatch({type: START_GAME_SUCCESS, payload: data});
    });
    socketClient.on("end.game.success", () => {
        dispatch({type: END_GAME_SUCCESS});
    });
    socketClient.on("next.round.success", data => {
        dispatch({type: NEXT_ROUND_SUCCESS, payload: data});
    });

    socketClient.on("start.round.success", data => {
        dispatch({type: START_ROUND_SUCCESS, payload: data});
    });

    socketClient.on("update.round.success", data => {
        dispatch({type: UPDATE_ROUND_SUCCESS, payload: data});
    });

    socketClient.on("finish.round.success", data => {
        dispatch({type: FINISH_ROUND_SUCCESS, payload: data});
    });

    socketClient.on("finish.game.success", () => {
        dispatch({type: FINISH_GAME_SUCCESS});
    });

    socketClient.on("reset.round.success", data => {
        dispatch({type: RESET_ROUND_SUCCESS, payload: data});
    });

    socketClient.on("prev.round.success", data => {
        dispatch({type: PREV_ROUND_SUCCESS, payload: data});
    });

    socketClient.on("next.finish.success", data => {
        dispatch({type: NEXT_FINISH_SUCCESS, payload: data});
    });

    socketClient.on("connectedUsers", data => {
        dispatch({type: USERS_GETTED, payload: JSON.parse(data)});
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
        if (response.refresh_token) {
            storeCookie("userToken", response.refresh_token);
            socketClient.socket.query.token = response.refresh_token;
        }
        dispatch({type: USER_GET_METADATA_SUCCEEDED, payload: response.response});
    });
    socketClient.emit("users.get.all");
}

function* flow(socketClient, dispatch) {
    yield all([
        takeEvery(CONNECT_APP, setupListeners, socketClient, dispatch)
    ]);
}

export default flow;
