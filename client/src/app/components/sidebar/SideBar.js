import React, {Component} from "react";

import ThemeSwitch from "../../containers/sidebar/themeSwitch";
import DisconnectSwitch from "../../containers/sidebar/disconnectSwitch";
import PassiveModeSwitch from "../../containers/sidebar/passiveModeSwitch";

class SideBar extends Component {
    constructor(props) {
        super(props);

        this.keyDown = this.keyDown.bind(this);
    }

    componentWillMount() {
        document.body.addEventListener("keydown", this.keyDown);
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.keyDown);
    }

    keyDown({keyCode}) {
        if (keyCode === 27 && this.props.mode === "passive") {
            this.props.quitPassiveMode();
        }
    }

    render() {
        return (
            <div className={this.props.mode === "passive" ? "sidebar sidebarHided" : "sidebar"}>
                <ThemeSwitch />
                <PassiveModeSwitch />
                <DisconnectSwitch />
            </div>
        );
    }
}

export default SideBar;