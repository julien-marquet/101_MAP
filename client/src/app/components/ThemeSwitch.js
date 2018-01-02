import React, {Component} from "react";
import PropTypes from "prop-types";

class ThemeSwitch extends Component {
    constructor(props)
    {
        super(props);
        this.selectKey = this.selectKey.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.state = {
            opened: false,
            selectedValue: this.props.themes.value
        };
    }
    componentWillReceiveProps(nextProps) {
        localStorage.setItem("param_theme", nextProps.themes.value);
    }
    selectKey(value) {
        this.props.storeActiveTheme({
            value: value
        });
        this.setState({
            selectedValue: value,
            opened: false
        });
    }
    toggleDropDown() {
        this.setState({
            opened: !this.state.opened
        });
    }
    renderOptions() {
        const options = [];
        this.props.themes.array.map((theme, index) => {
            options.push(
                <div key={index} className={"dropdown-option tile"}
                    onClick={() => {
                        this.selectKey(index);
                    }}>
                    <span>
                        {theme}
                    </span>
                </div>
            );
        });
        return options;
    }
    render()
    {
        return (
            <div className={`ThemeSwitch multi-dropdown  main-tile ${this.state.opened ? "opened" : "closed"}`}>
                <div className={"dropdown-header tile"}
                    onClick={() => {
                        this.toggleDropDown();
                    }}>
                    <span>{this.props.themes.array[this.state.selectedValue]}</span>
                </div>
                <div className={"dropdown-content"}>
                    {this.renderOptions()}
                </div>
            </div>
        );
    }
}

ThemeSwitch.proptypes = {
    storeActiveTheme: PropTypes.func.isRequired,
    themes:  PropTypes.shape({
        array: PropTypes.array.isRequired,
        value: PropTypes.number.isRequired
    })
};

export default ThemeSwitch;