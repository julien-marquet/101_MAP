import {takeEvery, all} from "redux-saga/effects";
import React from "react";
import config from "../../config/globalConfig";


import {
    USERS_GETTED,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED
} from "../actions/users";

import {
    TOAST_SHOW
} from "../actions/toasts";

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
        dispatch({
            type: TOAST_SHOW, 
            payload: {		
                type: "success",		
                timeout: 3000,		
                message: "Socket connection established",		
                action: null
            }
        });
        setTimeout(() => {
            dispatch({
                type: TOAST_SHOW, 
                payload: {		
                    type: "warn",		
                    timeout: null,		
                    message: "Your token has expired, please get a new one !",		
                    action: {
                        func: () => {
                            window.location.replace(`${config.apiEndPoint}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code`);
                        },
                        label: <i className="fas fa-sync"></i>,
                        dismissAfter: true
                    },
                }
            });
        }, (Math.floor(Date.now()/1000) - data.checked_at + data.expires_in)* 1000);
    });

    socketClient.on("error", err => {
        dispatch({
            type: TOAST_SHOW, 
            payload: {		
                type: "error",		
                timeout: 3000,		
                message: `Socket Error : ${err}`,		
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
        dispatch({type: USER_GET_METADATA_SUCCEEDED, payload: response});
    });
    socketClient.emit("users.get.all");
}

function* flow(socketClient, dispatch) {
    yield all([
        takeEvery(CONNECT_APP, setupListeners, socketClient, dispatch)
    ]);
}

export default flow;
