import {combineReducers} from "redux";

import app from "./app";
import users from "./users";
import themes from "./themes";
import globalState from "./globalState";

export default combineReducers({
    app,
    users,
    themes,
    globalState
});
