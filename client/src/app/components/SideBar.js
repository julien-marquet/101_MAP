import React, {Component} from "react";

import ThemeSwitch from "../containers/themeSwitch";
import DisconnectSwitch from "../containers/disconnectSwitch";

import "../scss/sidebar.css";

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