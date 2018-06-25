import {connect} from "react-redux";

import Scorer from "../components/Scorer";
import { GET_GAME, START_GAME, END_GAME, NEXT_ROUND, UPDATE_ROUND, FINISH_ROUND, RESET_ROUND, PREV_ROUND } from "../actions/scores";

const mapStateToProps = ({scores}) => {
    return {
        finishedRounds: scores.finishedRounds,
        activeRound: scores.activeRound,
        participants: scores.participants,
        nextRound: scores.nextRound,
        nextFinish: scores.nextFinish,
        isScorer: scores.isScorer,
        totalScores : scores.totalScores,
        isStarted: scores.isStarted,
        finished: scores.finished,
        totalRounds: scores.totalRounds
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGame: payload => dispatch({type: GET_GAME, payload}),
        startGame: payload => dispatch({type: START_GAME, payload}),
        endGame: payload => dispatch({type: END_GAME, payload}),
        goNextRound: payload => dispatch({type: NEXT_ROUND, payload}),
        updateRound: payload => dispatch({type: UPDATE_ROUND, payload}),
        finishRound: payload => dispatch({type: FINISH_ROUND, payload}),
        resetRound: payload => dispatch({type: RESET_ROUND, payload}),
        prevRound: payload => dispatch({type: PREV_ROUND, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scorer);
