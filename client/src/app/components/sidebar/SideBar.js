import React, {Component} from "react";

import ThemeSwitch from "../../containers/sidebar/themeSwitch";
import DisconnectSwitch from "../../containers/sidebar/disconnectSwitch";
import PassiveModeSwitch from "../../containers/sidebar/passiveModeSwitch";

class SideBar extends Component {
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