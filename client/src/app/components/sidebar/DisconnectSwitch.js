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
        if (this.props.active) {
            return (
                <div
                    onClick={this.disconnect}
                    className={"disconnectSwitch btn tile main-tile"}
                >
                    <span><i className={"fas fa-power-off"}></i></span>
                </div>
            );       
        }
        return null;
    }
}

DisconnectSwitch.proptypes = {
    disconnectApp: PropTypes.func.isRequired
};


export default DisconnectSwitch;