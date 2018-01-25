import {connect} from "react-redux";

import Toaster from "../../componentsToaster";
import {TOAST_HIDE} from "../actions//toasts";

const mapStateToProps = state => {
    return {
        toasts: state.toasts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        hideToast: (toast) => dispatch(TOAST_HIDE(toast))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toaster);
