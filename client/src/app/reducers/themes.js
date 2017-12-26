import {ACTIVE_THEME_SWAP} from "../actions/themes";
import globalConfig from "../../config/globalConfig";

const themeArray = [
    "dark",
    "light"
];
function getTheme() {
    const param = localStorage.getItem("param_theme");
    if (param)
        return (localStorage.getItem("param_theme"));
    else
        return themeArray.indexOf(globalConfig.defaultTheme);
}
const initialState = {
    array: themeArray,
    value: getTheme()
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
