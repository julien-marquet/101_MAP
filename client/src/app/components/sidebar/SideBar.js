import React, {Component} from "react";

import ThemeSwitch from "../../containers/sidebar/themeSwitch";
import DisconnectSwitch from "../../containers/sidebar/disconnectSwitch";
import PassiveModeSwitch from "../../containers/sidebar/passiveModeSwitch";

class SideBar extends Component {
    render() {
        return (
            <div className={this.props.mode === "passive" ? "sidebar sidebarHided" : "sidebar"}>
                <ThemeSwitch active={this.props.mode !== "passive"}/>
                <PassiveModeSwitch active={this.props.mode !== "passive"}/>
                <DisconnectSwitch active={this.props.mode !== "passive"}/>
            </div>
        );
    }
}

export default SideBar;