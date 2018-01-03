import {connect} from "react-redux";

import ThemeSwitch from "../../components/sidebar/ThemeSwitch";
import {ACTIVE_THEME_SWAP} from "../../actions/globalState";

const mapStateToProps = (state) => {
    return {
        themes: state.globalState.themes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        storeActiveTheme: payload => dispatch({type: ACTIVE_THEME_SWAP, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch);
