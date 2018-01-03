import {combineReducers} from "redux";

import app from "./app";
import users from "./users";
import globalState from "./globalState";

export default combineReducers({
    app,
    users,
    globalState
});
