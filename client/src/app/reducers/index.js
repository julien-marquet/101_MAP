import {combineReducers} from "redux";

import app from "./app";
import users from "./users";
import themes from "./themes";

export default combineReducers({
    app,
    users,
    themes
});
