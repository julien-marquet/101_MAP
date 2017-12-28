import React, {Component} from "react";
import {removeCookie} from "../helpers/cookies.helper";

class DisconnectSwitch extends Component {
    constructor() {
        super();
        this.disconnect = this.disconnect.bind(this);
    }
    disconnect() {
        //removeCookie("userToken");
        this.props.disconnectApp({connected: false});
        console.log("disconnect");
    }
    render()
    {
        return (
            <button onClick={() => { this.disconnect();}} className={"disconnectSwitch"}>
                Disconnect
            </button>
        );
    }
}

export default DisconnectSwitch;