import {connect} from "react-redux";

import App from "../components/App";

const mapStateToProps = state => {
    return {
        ...state
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
