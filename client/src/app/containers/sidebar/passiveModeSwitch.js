import {connect} from "react-redux";

import {TOAST_SHOW} from "../../actions/toasts";
import {MODE_PASSIVE_SET} from "../../actions/globalState";
import PassiveModeSwitch from "../../components/sidebar/PassiveModeSwitch";

const mapDispatchToProps = dispatch => {
    return {
        setPassiveMode: () => dispatch({type: MODE_PASSIVE_SET}),
        showToast: payload => dispatch({type: TOAST_SHOW, payload})
    };
};

export default connect(null, mapDispatchToProps)(PassiveModeSwitch);
