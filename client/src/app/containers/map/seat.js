import {connect} from "react-redux";

import Seat from "../../components/map/Seat";
import {ACTIVE_USER_SWAP} from "../../actions/users";
import {MODE_PASSIVE_UNSET} from "../../actions/globalState";
import {
    GAME_BOMB_EXPLODE,
    GAME_ENTITIES_DELETE,
    GAME_PLAYER_DEAD
} from "../../actions/bomberman";

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
        bombExplode: payload => dispatch({type: GAME_BOMB_EXPLODE, payload}),
        destroy: payload => dispatch({type: GAME_ENTITIES_DELETE, payload}),
        playerDead: () => dispatch({type: GAME_PLAYER_DEAD})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
