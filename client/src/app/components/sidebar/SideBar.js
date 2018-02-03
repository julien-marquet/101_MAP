import React, {Component} from "react";

import ThemeSwitch from "../../containers/sidebar/themeSwitch";
import DisconnectSwitch from "../../containers/sidebar/disconnectSwitch";

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