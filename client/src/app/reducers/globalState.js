import {
    DISCONNECT_APP,
    CONNECT_APP,
    ACTIVE_THEME_SWAP,
    MODE_PASSIVE_SET,
    MODE_PASSIVE_UNSET
} from "../actions/globalState";
import globalConfig from "../../config/globalConfig";

const initialState = {
    connected: false,
    themes: {
        array: globalConfig.themeArray,
        value: localStorage.getItem("param_theme") || globalConfig.themeArray.indexOf(globalConfig.defaultTheme)
    },
    mode: localStorage.getItem("mode") || "default"
};

const globalState = (state = initialState, {type, payload}) => {
    switch (type) {
    case ACTIVE_THEME_SWAP:
        return {
            ...state,
            themes: {
                ...state.themes,
                ...payload
            }
        };
    case DISCONNECT_APP:
        return {
            ...state,
            connected: false
        };
    case CONNECT_APP:
        return {
            ...state,
            connected: true
        };
    case MODE_PASSIVE_SET:
        return {
            ...state,
            mode: "passive"
        };
    case MODE_PASSIVE_UNSET:
        return {
            ...state,
            mode: "default"
        };
    default:
        return state;
    }
};

export default globalState;
