import {connect} from "react-redux";

import HostInfo from "../../components/map/HostInfo";
import {USER_GET_METADATA} from "../../actions/users";

const mapStateToProps = state => {
    return {
        activeUser: state.users.activeUser,
        user_metadata: state.users.user_metadata
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getUserMetadata: payload => dispatch({type: USER_GET_METADATA, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HostInfo);
