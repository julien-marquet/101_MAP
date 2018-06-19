import {GET_GAME_SUCCESS, START_GAME_SUCCESS} from "../actions/scores";

const initialState = {
    finishedRounds: [],
    activeRound: null,
    participants: [],
    nextRound: null,
    isScorer: false,
    isStarted: false
};

const toaster = (state = initialState, {type, payload}) => {
    switch (type) {
    case GET_GAME_SUCCESS:
        return {
            finishedRounds: payload.finishedRounds,
            activeRound: payload.activeRound,
            participants: payload.participants,
            nextRound: payload.nextRound,
            isScorer: payload.isScorer,
            isStarted: payload.isStarted
        };
    case START_GAME_SUCCESS: 
        return {
            ...state,
            isStarted: payload.isStarted,
        };
    default:
        return state;
    }
};

export default toaster;
