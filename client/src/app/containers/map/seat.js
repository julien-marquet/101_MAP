import {connect} from "react-redux";

import Seat from "../../components/map/Seat";
import {ACTIVE_USER_SWAP} from "../../actions/users";
import {MODE_PASSIVE_UNSET} from "../../actions/globalState";
import {GAME_ENTITY_DELETE} from "../../actions/bomberman";

const mapStateToProps = ({users, globalState, switchButton}) => {
    return {
        searchedUser: users.searchedUser,
        activeUser: users.activeUser,
        mode: globalState.mode,
        switchStatus: switchButton.position,
        currentUser: users.currentUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        storeActiveUsers: payload => dispatch({type: ACTIVE_USER_SWAP, payload}),
        quitPassiveMode: () => dispatch({type: MODE_PASSIVE_UNSET}),
        destroy: payload => dispatch({type: GAME_ENTITY_DELETE, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
