import {connect} from "react-redux";

import App from "../components/App";
import {CONNECT_APP} from "../actions/globalState";

const mapStateToProps = state => {
    return {
        ...state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        connectApp: payload => dispatch({type: CONNECT_APP, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
