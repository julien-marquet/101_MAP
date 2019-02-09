import {connect} from "react-redux";

import {TOAST_SHOW} from "../../actions/toasts";
import {
    MODE_PASSIVE_SET,
    DISCONNECT_APP
} from "../../actions/globalState";

import Sidebar from "../../components/sidebar/SideBar";

const mapStateToProps = ({globalState}) => {
    return {
        mode: globalState.mode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setPassiveMode: () => dispatch({type: MODE_PASSIVE_SET}),
        showToast: payload => dispatch({type: TOAST_SHOW, payload}),
        disconnectApp: () => dispatch({type: DISCONNECT_APP})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

