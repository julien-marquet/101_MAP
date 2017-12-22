import React, {Component} from "react";
import {storeCookie} from "../helpers/cookies.helper";
import PropTypes from "prop-types";

class Sockets extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connected: false
        };
    }

    componentWillMount() {
        this.props.socket.on("connectedUsers", data => {
            this.props.storeUsers(JSON.parse(data));
        });
        this.props.socket.on("authSuccess", data => {
            window.history.pushState("Home", "Home", "/");
            if (data && data.type == "code")
                storeCookie("userToken", data.token);
        });
    }

    render() {
        return (<div />);
    }
}

Sockets.propTypes = {
    socket: PropTypes.object.isRequired
};

export default Sockets;