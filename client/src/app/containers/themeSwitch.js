import {connect} from "react-redux";

import ThemeSwitch from "../components/ThemeSwitch";
import {ACTIVE_THEME_SWAP} from "../actions/themes";

const mapStateToProps = (state) => {
    return {
        themes: state.themes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        storeActiveTheme: payload => dispatch({type: ACTIVE_THEME_SWAP, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch);
