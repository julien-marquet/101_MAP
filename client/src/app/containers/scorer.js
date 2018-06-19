import {connect} from "react-redux";

import Scorer from "../components/Scorer";
import { GET_GAME } from "../actions/scores";

const mapStateToProps = ({scores}) => {
    return {
        finishedRounds: scores.finishedRounds,
        activeRound: scores.activeRound,
        participants: scores.participants,
        nextRound: scores.nextRound,
        isScorer: scores.isScorer,
        isStarted: scores.isStarted
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGame: payload => dispatch({type: GET_GAME, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scorer);
