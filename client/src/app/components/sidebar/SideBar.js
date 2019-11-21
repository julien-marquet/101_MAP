import React, {Component} from "react";
import PropTypes from "prop-types";

import Switch from "./Switch";
import ThemeSwitch from "../../containers/sidebar/themeSwitch";
import {removeCookie} from "../../helpers/cookies.helper";

class SideBar extends Component {
    constructor(props) {
        super(props);

        this.setPassiveMode = this.setPassiveMode.bind(this);
        this.disconnect = this.disconnect.bind(this);
    }

    disconnect() {
        if (this.props.mode !== "passive") {
            removeCookie("userToken");
            this.props.disconnectApp();
        }
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
        return (
            <div className={this.props.mode === "passive" ? "sidebar sidebarHided" : "sidebar"}>
                <ThemeSwitch active={this.props.mode !== "passive"}/>
                <Switch icon={"fas fa-film"} clickEvent={this.setPassiveMode} />
                <Switch
                    isLink={true}
                    alt={"Github"}
                    icon={"fab fa-github"}
                    className={"disconnectSwitch"}
                    href={"https://github.com/julien-marquet/101_MAP"}
                />
                <Switch icon={"fas fa-power-off"} clickEvent={this.disconnect} />
            </div>
        );
    }
}

SideBar.propTypes = {
    setPassiveMode: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
};

export default SideBar;

