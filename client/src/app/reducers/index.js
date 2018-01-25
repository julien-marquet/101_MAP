import {combineReducers} from "redux";

import app from "./app";
import users from "./users";
import globalState from "./globalState";
import toasts from "./toasts";

export default combineReducers({
    app,
    users,
    globalState,
    toasts
});
