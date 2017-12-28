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
        disconnectApp: () => dispatch({type: DISCONNECT_APP})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisconnectSwitch);
