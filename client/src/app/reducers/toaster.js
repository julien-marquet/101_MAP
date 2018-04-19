import {TOAST_HIDE, TOAST_SHOW} from "../actions/toasts";

const initialState = {
    toasts: {
        action: null
    }
};

const toaster = (state = initialState, {type, payload}) => {
    switch (type) {
    case TOAST_SHOW:
        state.toasts[(Date.now() + Math.random()).toString()] = {
            ...payload,
            timestamp: Date.now()
        };
        return {
            ...state
        };
    case TOAST_HIDE:
        return {
            ...state,
            toasts: Object.keys(state.toasts)
                .filter(key => key !== payload.id)
                .reduce((obj, key) => {
                    obj[key] = state.toasts[key];
                    return obj;
                }, {})
        };
    default:
        return state;
    }
};

export default toaster;
