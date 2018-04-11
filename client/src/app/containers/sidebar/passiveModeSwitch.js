import {connect} from "react-redux";

import {MODE_PASSIVE_SET} from "../../actions/globalState";
import PassiveModeSwitch from "../../components/sidebar/PassiveModeSwitch";

const mapDispatchToProps = dispatch => {
    return {
        setPassiveMode: () => dispatch({type: MODE_PASSIVE_SET})
    };
};

export default connect(null, mapDispatchToProps)(PassiveModeSwitch);
