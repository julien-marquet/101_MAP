import {connect} from "react-redux";

import Warzone from "../components/Warzone";
import {TOAST_SHOW} from "../actions/toasts";
import {ACTIVE_USER_SWAP} from "../actions/users";

const mapStateToProps = ({users, globalState}) => {
    return {
        users,
        mode: globalState.mode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        showToast: payload => dispatch({type: TOAST_SHOW, payload}),
        storeActiveUsers: payload => dispatch({type: ACTIVE_USER_SWAP, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Warzone);
