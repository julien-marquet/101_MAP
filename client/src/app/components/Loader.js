import React, {Component} from "react";
import {Transition} from "react-transition-group";

import "../scss/loader.css";

class Loader extends Component {
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

export default Loader;