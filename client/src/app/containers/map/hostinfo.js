import {connect} from "react-redux";

import HostInfo from "../../components/map/HostInfo";
import {GET_USER_METADATA} from "../../actions/users";

const mapStateToProps = state => {
    return {
        activeUser: state.users.activeUser,
        user_metadata: state.users.user_metadata
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getUserMetadata: payload => dispatch({type: GET_USER_METADATA, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HostInfo);
