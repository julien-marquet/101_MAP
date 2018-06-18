import {GET_SCORES_SUCCESS} from "../actions/scores";

const initialState = {
    participants: [],
    winner: null,
};

const toaster = (state = initialState, {type, payload}) => {
    switch (type) {
    case GET_SCORES_SUCCESS:
        return {
            participants: payload.participants,
            winner: payload.winner
        };
    default:
        return state;
    }
};

export default toaster;
