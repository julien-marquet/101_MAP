import {connect} from "react-redux";

import DisconnectSwitch from "../components/DisconnectSwitch";
import {DISCONNECT_APP} from "../actions/globalState";

const mapStateToProps = (state) => {
    return {
        globalState: state.globalState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        disconnectApp: payload => dispatch({type: DISCONNECT_APP, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisconnectSwitch);
