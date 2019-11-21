import React, {Component} from "react";
import PropTypes from "prop-types";

class ThemeSwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            selectedValue: this.props.themes.value
        };

        this.iconArray = [
            <i className={"far fa-circle"}></i>,
            <i className={"fas fa-circle"}></i>
        ];
        this.toggleDropDown = this.toggleDropDown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        localStorage.setItem("param_theme", nextProps.themes.value);
    }

    selectKey(value) {
        this.props.storeActiveTheme({value});
        this.setState({
            selectedValue: value,
            opened: false
        });
    }

    toggleDropDown() {
        if (this.props.active) {
            this.setState({
                opened: !this.state.opened
            });
        }
    }

    renderOptions() {
        return this.props.themes.array.map((theme, index) => {
            return (
                <div
                    key={`Theme${index}`}
                    className={"dropdown-option tile"}
                    onClick={() => {
                        this.selectKey(index);
                    }}>
                    <span>
                        {this.iconArray[index]}
                    </span>
                </div>
            );
        });
    }

    render() {
        return (
            <div className={`ThemeSwitch multi-dropdown  main-tile ${this.state.opened ? "opened" : "closed"}`}>
                <div 
                    className={"dropdown-header tile"}
                    onClick={this.toggleDropDown}
                >
                    <span> <i className={"fas fa-adjust"}></i></span>
                </div>
                <div className={"dropdown-content"}>
                    {this.renderOptions()}
                </div>
            </div>
        );
    }
}

ThemeSwitch.propTypes = {
    storeActiveTheme: PropTypes.func.isRequired,
    themes:  PropTypes.shape({
        array: PropTypes.array.isRequired,
        value: PropTypes.number.isRequired
    })
};

export default ThemeSwitch;
