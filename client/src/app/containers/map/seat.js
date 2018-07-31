import {connect} from "react-redux";

import Seat from "../../components/map/Seat";
import {ACTIVE_USER_SWAP} from "../../actions/users";
import {MODE_PASSIVE_UNSET} from "../../actions/globalState";

const mapStateToProps = ({users, globalState, switchButton}) => {
    return {
        searchedUser: users.searchedUser,
        activeUser: users.activeUser,
        mode: globalState.mode,
        switchStatus: switchButton.position
    };
};

const mapDispatchToProps = dispatch => {
    return {
        storeActiveUsers: payload => dispatch({type: ACTIVE_USER_SWAP, payload}),
        quitPassiveMode: () => dispatch({type: MODE_PASSIVE_UNSET})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
