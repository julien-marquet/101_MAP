import {SWITCH_MOVE} from "../actions/switch";

const initialState = {
    position: 1
};

const globalState = (state = initialState, {type, payload}) => {
    switch (type) {
    case SWITCH_MOVE:
        return {
            position: payload
        };
    default:
        return state;
    }
};

export default globalState;
