import {connect} from "react-redux";

import Toaster from "../components/Toaster";
import {TOAST_HIDE} from "../actions/toasts";

const mapStateToProps = state => {
    return {
        toaster: state.toaster
    };
};

const mapDispatchToProps = dispatch => {
    return {
        hideToast: payload => dispatch({type: TOAST_HIDE, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toaster);
