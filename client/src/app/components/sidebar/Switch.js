import React, {Component} from "react";
import PropTypes from "prop-types";

class Switch extends Component {
    constructor(props) {
        super(props);

        this.disconnect = this.disconnect.bind(this);
    }

    disconnect() {
        if (this.props.active) {
            this.props.disconnectApp();
        }
    }

    render() {
        return (
            <a
                alt={"Github"}
                className={"disconnectSwitch btn tile main-tile"}
                href={"https://github.com/julien-marquet/101_MAP"}
            >
                <span><i className={"fab fa-github"}></i></span>
            </a>
        );
    }
}

Switch.proptypes = {
    disconnectApp: PropTypes.func.isRequired
};


export default Switch;