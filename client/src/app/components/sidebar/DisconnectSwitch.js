import React, {Component} from "react";
import PropTypes from "prop-types";

import {removeCookie} from "../../helpers/cookies.helper";

class DisconnectSwitch extends Component {
    constructor(props) {
        super(props);

        this.disconnect = this.disconnect.bind(this);
    }

    disconnect() {
        removeCookie("userToken");
        this.props.disconnectApp();
    }

    render() {
        return (
            <div
                onClick={this.disconnect}
                className={"disconnectSwitch btn tile main-tile"}
            >
                <span><i class="fas fa-power-off"></i></span>
            </div>
        );
    }
}

DisconnectSwitch.proptypes = {
    disconnectApp: PropTypes.func.isRequired
};


export default DisconnectSwitch;