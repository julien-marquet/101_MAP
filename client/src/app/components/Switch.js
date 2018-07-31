import React, {Component} from "react";

import "../scss/switch.css";

class Switch extends Component {
    render() {
        return (
            <div className={"switch"}>
                <div className={`switchButton position${this.props.position}`} />
            </div>
        );
    }
}

export default Switch;
