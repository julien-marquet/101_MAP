import {all, takeLatest, call, put} from "redux-saga/effects";

import {
    USER_GET_METADATA,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED
} from "../actions/users";
import {getUserInfos} from "../api/users";

function* getUserMetadata({payload}) {
    const response = yield call(getUserInfos, payload);
    if (response.error !== undefined) {
        yield put({type: USER_GET_METADATA_FAILED, payload: response.error});
    }
    else {
        yield put({type: USER_GET_METADATA_SUCCEEDED, payload: response});
    }
}

function* flow() {
    yield all([
        takeLatest(USER_GET_METADATA, getUserMetadata)
    ]);
}

export default flow;
