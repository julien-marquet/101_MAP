import React, {Component} from "react";

import ThemeSwitch from "../../containers/sidebar/themeSwitch";
import DisconnectSwitch from "../../containers/sidebar/disconnectSwitch";

import "../../scss/sidebar.css";

class SideBar extends Component {
    render()
    {
        return (
            <div className={"sidebar"}>
                <ThemeSwitch />
                <DisconnectSwitch />
            </div>
        );
    }
}

export default SideBar;