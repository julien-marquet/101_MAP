import {GET_GAME_SUCCESS, START_GAME_SUCCESS, END_GAME_SUCCESS, NEXT_ROUND_SUCCESS, START_ROUND_SUCCESS, UPDATE_ROUND_SUCCESS, FINISH_ROUND_SUCCESS} from "../actions/scores";

const initialState = {
    finishedRounds: [],
    activeRound: null,
    participants: [],
    nextRound: null,
    isScorer: false,
    isStarted: false,
    totalScores: null
};

const toaster = (state = initialState, {type, payload}) => {
    console.log(payload)
    switch (type) {
    case GET_GAME_SUCCESS:
        return {
            finishedRounds: [
                ...payload.finishedRounds,
            ],
            activeRound: payload.activeRound ? {
                ...payload.activeRound,
            } : null,
            participants: [
                ...payload.participants,
            ],
            nextRound: payload.nextRound,
            isScorer: payload.isScorer,
            isStarted: payload.isStarted,
            totalScores : [
                ...payload.totalScores,
            ]
        };
    case START_GAME_SUCCESS: 
        return {
            finishedRounds: [
                ...payload.finishedRounds,
            ],
            activeRound: payload.activeRound ? {
                ...payload.activeRound,
            } : null,
            participants: [
                ...payload.participants,
            ],
            nextRound: payload.nextRound,
            totalScores : [
                ...payload.totalScores,
            ],
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
            activeRound: payload.activeRound ? {
                ...payload.activeRound,
            } : null,
            totalScores : [
                ...payload.totalScores,
            ],
            finishedRounds: [
                ...payload.finishedRounds,
            ]
        };
    case UPDATE_ROUND_SUCCESS:
        return {
            ...state,
            activeRound: payload.activeRound ? {
                ...payload.activeRound,
            } : null,
        };
    case FINISH_ROUND_SUCCESS:
        return {
            ...state,
            totalScores: [
                ...payload.totalScores
            ],
            activeRound: {
                ...state.activeRound,
                finished: true
            },
        };
    default:
        return state;
    }
};

export default toaster;
