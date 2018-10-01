import {connect} from "react-redux";

import App from "../components/App";
import {
    CONNECT_APP,
    MODE_PASSIVE_UNSET,
    MODE_PASSIVE_SET
} from "../actions/globalState";
import {TOAST_SHOW} from "../actions/toasts";
import {SWITCH_MOVE} from "../actions/switch";
import {USER_CLEAR_ACTIVE} from "../actions/users";
import {ACTIVE_THEME_SWAP} from "../actions/globalState";
import {GAME_PLAYER_MOVE} from "../actions/bomberman";

const mapStateToProps = ({globalState, switchButton, game}) => {
    const {mode, themes, connected} = globalState;
    return {
        mode,
        themes,
        connected,
        position: game.position,
        switchButton: {
            position: switchButton.position
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        connectApp: payload => dispatch({type: CONNECT_APP, payload}),
        quitPassiveMode: () => dispatch({type: MODE_PASSIVE_UNSET}),
        setPassiveMode: () => dispatch({type: MODE_PASSIVE_SET}),
        showToast: payload => dispatch({type: TOAST_SHOW, payload}),
        moveSwitch: payload => dispatch({type: SWITCH_MOVE, payload}),
        clearActiveUser: () => dispatch({type: USER_CLEAR_ACTIVE}),
        storeActiveTheme: payload => dispatch({type: ACTIVE_THEME_SWAP, payload}),
        movePlayer: payload => dispatch({type: GAME_PLAYER_MOVE, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
