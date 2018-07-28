import {connect} from "react-redux";

import App from "../components/App";
import {
    CONNECT_APP,
    MODE_PASSIVE_UNSET,
    MODE_PASSIVE_SET
} from "../actions/globalState";
import {TOAST_SHOW} from "../actions/toasts";
import {SWITCH_MOVE} from "../actions/switch";

const mapStateToProps = ({globalState, switchButton}) => {
    const {mode, themes, connected} = globalState;
    return {
        mode,
        themes,
        connected,
        switchButton: {
            position: switchButton.position
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        connectApp: payload => dispatch({type: CONNECT_APP, payload}),
        quitPassiveMode: () => dispatch({type: MODE_PASSIVE_UNSET}),
        setPassiveMode: () => dispatch({type: MODE_PASSIVE_SET}),
        showToast: payload => dispatch({type: TOAST_SHOW, payload}),
        moveSwitch: payload => dispatch({type: SWITCH_MOVE, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
