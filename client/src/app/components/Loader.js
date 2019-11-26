import React, {Component} from "react";
import {Transition} from "react-transition-group";
import PropTypes from "prop-types";

import "../scss/loader.css";

class Loader extends Component {

    shouldComponentUpdate(nextProps) {
        if (nextProps.in !== this.props.in)
            return true;
        return false;
    }

    render()
    {
        return (
            <Transition in={this.props.in} timeout={0}>
                {(status) => (
                    <div className={`${this.props.name ? `loader${this.props.name}` : ""} loader ${status}`} />
                )}
            </Transition>
        );
    }
}

Loader.propTypes = {
    in: PropTypes.bool.isRequired,
    name: PropTypes.string
};

export default Loader;