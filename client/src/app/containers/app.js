import {connect} from "react-redux";

import App from "../components/App";
import {
    CONNECT_APP,
    MODE_PASSIVE_UNSET,
    MODE_PASSIVE_SET
} from "../actions/globalState";
import {TOAST_SHOW} from "../actions/toasts";

const mapStateToProps = ({globalState}) => {
    const {mode, themes, connected} = globalState;
    return {
        mode,
        themes,
        connected
    };
};

const mapDispatchToProps = dispatch => {
    return {
        connectApp: payload => dispatch({type: CONNECT_APP, payload}),
        quitPassiveMode: () => dispatch({type: MODE_PASSIVE_UNSET}),
        setPassiveMode: () => dispatch({type: MODE_PASSIVE_SET}),
        showToast: payload => dispatch({type: TOAST_SHOW, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
