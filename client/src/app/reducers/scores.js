import {GET_GAME_SUCCESS, START_GAME_SUCCESS, END_GAME_SUCCESS, NEXT_ROUND_SUCCESS, START_ROUND_SUCCESS, UPDATE_ROUND_SUCCESS, FINISH_ROUND_SUCCESS, FINISH_GAME_SUCCESS, RESET_ROUND_SUCCESS, PREV_ROUND_SUCCESS, NEXT_FINISH_SUCCESS} from "../actions/scores";

const initialState = {
    finishedRounds: [],
    activeRound: null,
    participants: [],
    nextRound: null,
    isScorer: false,
    isStarted: false,
    totalScores: null,
    totalRounds: 0,
    finished: false,
    nextFinish: null
};

const toaster = (state = initialState, {type, payload}) => {
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
            nextFinish: payload.nextFinish,
            isScorer: payload.isScorer,
            isStarted: payload.isStarted,
            totalScores : [
                ...payload.totalScores,
            ],
            finished: payload.finished,
            totalRounds: payload.totalRounds
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
            nextFinish: payload.nextFinish,
            totalScores : [
                ...payload.totalScores,
            ],
            isScorer: payload.isScorer || state.isScorer,
            isStarted: true,
            finished: payload.finished,
            totalRounds: payload.totalRounds
        };
    case END_GAME_SUCCESS: 
        return {
            ...initialState,
            participants: [
                ...state.participants
            ],
            isScorer: state.isScorer
        };
    case NEXT_ROUND_SUCCESS:
        return {
            ...state,
            nextRound: payload.nextRound,
            nextFinish: initialState.nextFinish,
            activeRound: {
                ...state.activeRound,
                finished: true
            },
            totalScores: {
                ...payload.totalScores
            }
        };
    case START_ROUND_SUCCESS:
        return {
            ...state,
            nextRound: initialState.nextRound,
            nextFinish: initialState.nextFinish,
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
            nextRound: initialState.nextRound,
            nextFinish: initialState.nextFinish,
            totalScores: [
                ...payload.totalScores
            ],
            activeRound: {
                ...state.activeRound,
                finished: true
            },
            finishedRounds: [
                ...payload.finishedRounds
            ]
        };
    case FINISH_GAME_SUCCESS:
        return {
            ...state,
            finished: true
        };
    case RESET_ROUND_SUCCESS:
        return {
            ...state,
            nextRound: initialState.nextRound,
            nextFinish: initialState.nextFinish,
            activeRound: {
                ...payload.activeRound
            },
            totalScores: [
                ...payload.totalScores,
            ],
            finishedRounds: [
                ...payload.finishedRounds,
            ],
            finished: payload.finished,
        };
    case PREV_ROUND_SUCCESS: 
        return {
            ...state,
            nextRound: initialState.nextRound,
            nextFinish: initialState.nextFinish,
            activeRound: {
                ...payload.activeRound
            },
            totalScores: [
                ...payload.totalScores,
            ],
            finishedRounds: [
                ...payload.finishedRounds,
            ],
            finished: payload.finished,
        };
    case NEXT_FINISH_SUCCESS:
        return {
            ...state,
            nextRound: initialState.nextRound,
            nextFinish: payload.nextFinish
        };
    default:
        return state;
    }
};

export default toaster;
