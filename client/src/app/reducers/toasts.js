import {TOAST_HIDE, TOAST_SHOW} from "../actions/toasts";

const initialState = {
    toasts: []
};

const toasts = (state = initialState, {type, payload}) => {
    switch (type) {
    case TOAST_SHOW:
        return {
            ...state,
            toasts: {
                ...toasts,
                [(Date.now() + Math.random()).toString()]: {
                    ...payload,
                    timestamp: Date.now()
                }
            }
        };
    case TOAST_HIDE:
        return {
            ...state
        };
    default:
        return state;
    }
};

export default toasts;
