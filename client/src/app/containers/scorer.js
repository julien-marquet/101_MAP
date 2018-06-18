import {connect} from "react-redux";

import Scorer from "../components/Scorer";
import { GET_SCORES } from "../actions/scores";

const mapStateToProps = ({scores}) => {
    return {
        participants: scores.participants,
        winner: scores.winner
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getScores: payload => dispatch({type: GET_SCORES, payload}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scorer);
