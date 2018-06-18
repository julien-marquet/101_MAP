import {GET_SCORES_SUCCESS} from "../actions/scores";

const initialState = {
    participants: []
};

const toaster = (state = initialState, {type, payload}) => {
    switch (type) {
    case GET_SCORES_SUCCESS:
        return {
            participants: payload
        };
    default:
        return state;
    }
};

export default toaster;
