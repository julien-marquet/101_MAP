import React, {Component} from "react";
// import PropTypes from "prop-types";

class PassiveModeSwitch extends Component {
    constructor(props) {
        super(props);

        this.setPassiveMode = this.setPassiveMode.bind(this);
    }

    setPassiveMode() {
        this.props.setPassiveMode();
        localStorage.setItem("mode", "passive");
        this.props.showToast({
            type: "info",		
            timeout: 2000,
            message: "Press escape to quit passive mode"
        });
    }

    render() {
        return (
            <div
                onClick={this.setPassiveMode}
                className={"btn tile main-tile"}
            >
                <span><i className={"fas fa-film"}></i></span>
            </div>
        );
    }
}

PassiveModeSwitch.proptypes = {
};


export default PassiveModeSwitch;