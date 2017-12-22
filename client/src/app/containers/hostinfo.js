import {connect} from "react-redux";

import HostInfo from "../components/map/HostInfo";

const mapStateToProps = state => {
    return {
        activeUser: state.users.activeUser
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HostInfo);
