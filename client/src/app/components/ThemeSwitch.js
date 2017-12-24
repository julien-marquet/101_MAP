import React, {Component} from "react";

class ThemeSwitch extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            selectedValue: this.props.themes.value
        };
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
        let options = [];
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

export default ThemeSwitch;