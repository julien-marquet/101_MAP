import {combineReducers} from "redux";

import app from "./app";
import users from "./users";
import globalState from "./globalState";
import toaster from "./toaster";
import scores from "./scores";

export default combineReducers({
    app,
    users,
    globalState,
    toaster,
    scores
});
