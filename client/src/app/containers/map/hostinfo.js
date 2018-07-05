import {connect} from "react-redux";

import HostInfo from "../../components/map/HostInfo";
import {USER_GET_METADATA, USER_CLEAR_ACTIVE} from "../../actions/users";

const mapStateToProps = ({users, globalState}) => {
    return {
        activeUser: users.activeUser,
        user_metadata: users.user_metadata,
        mode: globalState.mode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getUserMetadata: payload => dispatch({type: USER_GET_METADATA, payload}),
        clearActiveUser: () => dispatch({type: USER_CLEAR_ACTIVE})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HostInfo);
