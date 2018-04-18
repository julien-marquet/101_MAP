import React, {Component} from "react";

class PassiveModeSwitch extends Component {
    constructor(props) {
        super(props);

        this.setPassiveMode = this.setPassiveMode.bind(this);
    }

    setPassiveMode() {
        if (this.props.mode !== "passive") {
            this.props.setPassiveMode();
            localStorage.setItem("mode", "passive");
            this.props.showToast({
                type: "info",		
                timeout: 2000,
                message: "Press escape to quit passive mode"
            });
        }
    }

    render() {
        if (this.props.active) {
            return (
                <div
                    onClick={this.setPassiveMode}
                    className={"btn tile main-tile"}
                >
                    <span><i className={"fas fa-film"}></i></span>
                </div>
            );
        }
        return null;
    }
}

export default PassiveModeSwitch;