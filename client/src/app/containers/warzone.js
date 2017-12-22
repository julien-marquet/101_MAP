import {connect} from "react-redux";

import Warzone from "../components/Warzone";

const mapStateToProps = state => {
    return {
        users: state.users
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Warzone);
