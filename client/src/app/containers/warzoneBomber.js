import {connect} from "react-redux";

import WarzoneBomber from "../components/WarzoneBomber";
import {TOAST_SHOW} from "../actions/toasts";
import {ACTIVE_USER_SWAP, USER_CLEAR_ACTIVE} from "../actions/users";
import {SWITCH_MOVE} from "../actions/switch";

const mapStateToProps = ({users, globalState, switchButton}) => {
    return {
        users,
        mode: globalState.mode,
        switchButton: {
            position: switchButton.position
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showToast: payload => dispatch({type: TOAST_SHOW, payload}),
        storeActiveUsers: payload => dispatch({type: ACTIVE_USER_SWAP, payload}),
        moveSwitch: payload => dispatch({type: SWITCH_MOVE, payload}),
        clearActiveUser: () => dispatch({type: USER_CLEAR_ACTIVE}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WarzoneBomber);
