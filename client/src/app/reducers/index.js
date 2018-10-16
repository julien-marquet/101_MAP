import {combineReducers} from "redux";

import app from "./app";
import users from "./users";
import game from "./game";
import globalState from "./globalState";
import toaster from "./toaster";
import switchButton from "./switchButton";

export default combineReducers({
    app,
    users,
    game,
    globalState,
    toaster,
    switchButton
});
