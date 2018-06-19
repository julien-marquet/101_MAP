import {GET_GAME_SUCCESS, START_GAME_SUCCESS, END_GAME_SUCCESS, NEXT_ROUND_SUCCESS, START_ROUND_SUCCESS, UPDATE_ROUND_SUCCESS} from "../actions/scores";

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
    console.log(payload)
        return {
            finishedRounds: payload.finishedRounds,
            activeRound: payload.activeRound,
            participants: payload.participants,
            nextRound: payload.nextRound,
            isScorer: payload.isScorer,
            isStarted: true,
        };
    case END_GAME_SUCCESS: 
        return {
            ...initialState,
            isScorer: state.isScorer
        };
    case NEXT_ROUND_SUCCESS:
        return {
            ...state,
            nextRound: payload.nextRound
        };
    case START_ROUND_SUCCESS:
        return {
            ...state,
            nextRound: initialState.nextRound,
            activeRound: payload.activeRound
        };
    case UPDATE_ROUND_SUCCESS:
        return {
            ...state,
            activeRound: payload.activeRound
        };
    default:
        return state;
    }
};

export default toaster;
