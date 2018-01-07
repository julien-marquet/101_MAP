import React, {Component} from "react";
import {Transition} from "react-transition-group";
import PropTypes from "prop-types";

import "../scss/loader.css";

class Loader extends Component {

    shouldComponentUpdate(nextProps) {
        if (nextProps.in != this.props.in)
            return true;
        return false;
    }

    render()
    {
        return (
            <Transition in={this.props.in} timeout={0}>
                {(status) => (
                    <div className={`loader ${status}`} />
                )}
            </Transition>
        );
    }
}

Loader.proptypes = {
    in: PropTypes.bool.isRequired
};

export default Loader;