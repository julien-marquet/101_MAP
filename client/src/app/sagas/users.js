import { all, takeEvery } from "redux-saga/effects";

import {USER_GET_METADATA, USER_GET_METADATA_SUCCEEDED, USER_GET_METADATA_FAILED} from "../actions/users";
import globalConfig from "../../config/globalConfig";
import {retrieveCookie} from "../helpers/cookies.helper";


function getUserMetadata(dispatch, action) {
    const userToken = retrieveCookie("userToken");
    fetch(`${globalConfig.apiEndPoint}/v2/users/${action.payload}`, {
        headers: {
            "authorization": `Bearer ${userToken}`
        }
    })
        .then((response) => response.json())
        .then(response => {
            dispatch({type: USER_GET_METADATA_SUCCEEDED, payload: response});
        })
        .catch(error => {
            dispatch({type: USER_GET_METADATA_FAILED, payload: error});
        });
}

function* flow(dispatch) {
    yield all([
        takeEvery(USER_GET_METADATA, getUserMetadata, dispatch)
    ]);
}

export default flow;
