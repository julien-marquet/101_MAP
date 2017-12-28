import {DISCONNECT_APP, CONNECT_APP} from "../actions/globalState";

const initialState = {
    connected: false
};

const globalState = (state = initialState, {type}) => {
    switch (type) {
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
    default:
        return state;
    }
};

export default globalState;
