import {ACTIVE_THEME_SWAP} from "../actions/themes";
import globalConfig from "../../config/globalConfig";

const themeArray = [
    "dark",
    "light"
];

const initialState = {
    array: themeArray,
    value: localStorage.getItem("param_theme") || themeArray.indexOf(globalConfig.defaultTheme)
};

const themes = (state = initialState, {type, payload}) => {
    switch (type) {
    case ACTIVE_THEME_SWAP:
        return {
            ...state,
            ...payload
        };
    default:
        return state;
    }
};

export default themes;
