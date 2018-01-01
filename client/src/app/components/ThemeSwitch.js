import React, {Component} from "react";
import PropTypes from "prop-types";

class ThemeSwitch extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            selectedValue: this.props.themes.value
        };
    }
    componentWillReceiveProps(nextProps) {
        localStorage.setItem("param_theme", nextProps.themes.value);
    }
    selectKey(event) {
        this.props.storeActiveTheme({
            value: parseInt(event.target.value)
        });
        this.setState({
            selectedValue: event.target.value
        });
    }
    renderOptions() {
        const options = [];
        this.props.themes.array.map((theme, index) => {
            options.push(
                <option key={index} value={index}>{theme}</option>
            );
        });
        return options;
    }
    render()
    {
        return (
            <div className={"ThemeSwitch"}>
                <select defaultValue={this.state.selectedValue} onChange={this.selectKey.bind(this)}>
                    {this.renderOptions()}
                </select>
            </div>
        );
    }
}

ThemeSwitch.proptypes = {
    storeActiveTheme: PropTypes.func.isRequired,
    themes: {
        array: PropTypes.array.isRequired,
        value: PropTypes.number.isRequired
    }
};

export default ThemeSwitch;