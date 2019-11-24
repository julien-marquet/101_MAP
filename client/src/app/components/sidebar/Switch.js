import React, {Component} from "react";
import PropTypes from "prop-types";

class Switch extends Component {
    render() {
        if (this.props.isLink) {
            return (
                <a
                    alt={"Github"}
                    className={`${this.props.className} btn tile main-tile`}
                    href={this.props.href}
                >
                    <span><i className={this.props.icon}></i></span>
                </a>
            );
        }
        return (
            <div
                className={`${this.props.className} btn tile main-tile`}
                onClick={() => this.props.clickEvent()}
            >
                <span><i className={this.props.icon}></i></span>
            </div>
        );
    }
}

Switch.propTypes = {
    icon: PropTypes.string,
    clickEvent: PropTypes.func,
    isLink: PropTypes.bool,
    className: PropTypes.string,
    href: PropTypes.string,
    alt: PropTypes.string
};

Switch.defaultProps = {
    isLink: false,
    className: ""
};

export default Switch;

