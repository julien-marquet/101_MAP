import {take, put, call, fork, takeEvery, all} from 'redux-saga/effects'

// function* defaultProps() {
//   yield call(delay, 2000);
//   yield put({type: APP_GET_PROPS_SUCCESS});
// }

// function* defaultPropsWatcher() {
//   yield takeEvery(APP_GET_PROPS, defaultProps);
// }

function* flow() {
  yield all([
  ]);
}

export default flow;