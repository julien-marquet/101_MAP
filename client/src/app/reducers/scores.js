import {GET_SCORES_SUCCESS, UPDATE_SCORES_SUCCESS} from "../actions/scores";

const initialState = {
    participants: [],
    winner: null,
    isScorer: false
};

const toaster = (state = initialState, {type, payload}) => {
    switch (type) {
    case GET_SCORES_SUCCESS:
        return {
            participants: payload.participants,
            winner: payload.winner,
            isScorer: payload.isScorer
        };
    case UPDATE_SCORES_SUCCESS: 
        return {
            participants: payload.participants,
            winner: payload.winner,
            isScorer: payload.isScorer
        };
    default:
        return state;
    }
};

export default toaster;
