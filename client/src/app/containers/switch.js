import {connect} from "react-redux";

import Switch from "../components/Switch";

const mapStateToProps = ({switchButton}) => {
    return {
        position: switchButton.position
    };
};

export default connect(mapStateToProps)(Switch);
