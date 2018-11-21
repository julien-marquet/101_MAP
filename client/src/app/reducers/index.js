import {combineReducers} from "redux";

import app from "./app";
import users from "./users";
import globalState from "./globalState";
import toaster from "./toaster";
import switchButton from "./switchButton";
import coalitions from "./coalitions";

export default combineReducers({
    app,
    users,
    globalState,
    toaster,
    switchButton,
    coalitions
});
