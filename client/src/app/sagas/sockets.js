import {takeEvery, all} from "redux-saga/effects";
import {
    USERS_GETTED,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED,
    USER_WHOAMI
} from "../actions/users";
import {
    GAME_PLAYER_POSITION_SET,
    GAME_PLAYER_CURRENT_MOVE,
    GAME_PLAYER_MOVE,
    GAME_ENTITY_DELETE,
    GAME_PLAYER_FIRE,
    GAME_ENTITIES_DELETE,
    GAME_PLAYER_DEAD
} from "../actions/bomberman";
import {TOAST_SHOW} from "../actions/toasts";
import {CONNECT_APP} from "../actions/globalState";
import {storeCookie} from "../helpers/cookies.helper";

function setupListeners(socketClient, dispatch) {
    socketClient.on("connectedUsers", data => dispatch({type: USERS_GETTED, payload: JSON.parse(data)}));
    
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
    socketClient.on("token.refreshed", token => {
        storeCookie("userToken", token);
        socketClient.socket.query.token = token;
    });
    socketClient.on("page.refresh", () => window.location.reload());
    socketClient.on("whoami", user => {
        if (user.hostname === undefined) {
            console.error("User not connected");
        } else {
            dispatch({type: GAME_PLAYER_POSITION_SET, payload: user.hostname});
        }
        dispatch({type: USER_WHOAMI, payload: user});
    });
    socketClient.emit("users.get.all");
    socketClient.on("game.player.move", payload => {
        Object.keys(payload).map(key => {
            if (payload[key] === null) {
                delete payload[key];
                dispatch({type: GAME_ENTITY_DELETE, payload: key});
            }
        });
        if (Object.keys(payload).length === 0) {
            return ;
        }
        if (payload.isRollback) {
            dispatch({type: GAME_PLAYER_CURRENT_MOVE, payload});
        } else {
            if (payload.newPos !== null) {
                dispatch({type: GAME_PLAYER_MOVE, payload});
            } else {
                dispatch({type: GAME_ENTITY_DELETE, payload: payload.oldPos});
            }
        }
    });
    socketClient.on("game.player.fire", payload => dispatch({type: GAME_PLAYER_FIRE, payload}));
    socketClient.on("game.entities.delete", payload => {
        Object.keys(payload).map(key => {
            payload[key] = undefined;
        });
        dispatch({type: GAME_ENTITIES_DELETE, payload});
    });
    socketClient.on("game.error", err => {
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
}

function* flow(socketClient, dispatch) {
    yield all([
        takeEvery(CONNECT_APP, setupListeners, socketClient, dispatch)
    ]);
}

export default flow;
