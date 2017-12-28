import React, {Component} from "react";
// import {removeCookie} from "../helpers/cookies.helper";

class DisconnectSwitch extends Component {
    constructor(props) {
        super(props);

        this.disconnect = this.disconnect.bind(this);
    }

    disconnect() {
        //removeCookie("userToken");
        this.props.disconnectApp({connected: false});
    }

    render() {
        return (
            <button
                onClick={this.disconnect}
                className={"disconnectSwitch"}
            >
                Disconnect
            </button>
        );
    }
}

export default DisconnectSwitch;