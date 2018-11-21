import React, {Component} from "react";

class Switch extends Component {
    constructor(props) {
        super(props);
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

Switch.proptypes = {};

export default Switch;