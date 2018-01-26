import {connect} from "react-redux";

import App from "../components/App";
import {CONNECT_APP} from "../actions/globalState";
import {TOAST_SHOW} from "../actions/toasts";

const mapStateToProps = state => {
    return {
        ...state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        connectApp: payload => dispatch({type: CONNECT_APP, payload}),
        openToast: payload => dispatch({type: TOAST_SHOW, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
