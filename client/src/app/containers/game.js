import {connect} from "react-redux";

import App from "../components/App";
// import {GAME_MOVE_PLAYER} from "../actions/bomberman";

// const mapStateToProps = ({globalState, switchButton, users}) => {
//     return {
        
//     };
// };

const mapDispatchToProps = dispatch => {
    return {
        movePlayer: payload => dispatch({type: "a", payload})
    };
};

export default connect(null, mapDispatchToProps)(App);
