import { all, takeEvery } from "redux-saga/effects";

import {GET_USER_METADATA, GET_USER_METADATA_SUCCEEDED, GET_USER_METADATA_FAILED} from "../actions/users";
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
            dispatch({type: GET_USER_METADATA_SUCCEEDED, payload: response});
        })
        .catch(error => {
            dispatch({type: GET_USER_METADATA_FAILED, payload: error});
        });
}

function* flow(dispatch) {
    yield all([
        takeEvery(GET_USER_METADATA, getUserMetadata, dispatch)
    ]);
}

export default flow;
