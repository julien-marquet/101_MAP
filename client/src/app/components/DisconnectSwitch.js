import React, {Component} from "react";
import {removeCookie} from "../helpers/cookies.helper";
import PropTypes from "prop-types";

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
            <button
                onClick={this.disconnect}
                className={"disconnectSwitch btn tile main-tile"}
            >
                Disconnect
            </button>
        );
    }
}

DisconnectSwitch.proptypes = {
    disconnectApp: PropTypes.func.isRequired
};


export default DisconnectSwitch;