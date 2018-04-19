import {connect} from "react-redux";

import Sidebar from "../../components/sidebar/SideBar";

const mapStateToProps = ({globalState}) => {
    return {
        mode: globalState.mode
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
