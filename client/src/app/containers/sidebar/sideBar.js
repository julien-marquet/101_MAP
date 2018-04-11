import {connect} from "react-redux";

import Sidebar from "../../components/sidebar/SideBar";

const mapStateToProps = ({globalState}) => {
    return {
        mode: globalState.mode
    };
};

export default connect(mapStateToProps, null)(Sidebar);
