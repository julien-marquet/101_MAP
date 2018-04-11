import {connect} from "react-redux";

import Sidebar from "../../components/sidebar/SideBar";
import {MODE_PASSIVE_UNSET} from "../../actions/globalState";

const mapStateToProps = ({globalState}) => {
    return {
        mode: globalState.mode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        quitPassiveMode: () => dispatch({type: MODE_PASSIVE_UNSET})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
