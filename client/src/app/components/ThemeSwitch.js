import React, {Component} from "react";

class ThemeSwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: this.props.themes.value
        };

        this.selectKey = this.selectKey.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        localStorage.setItem("param_theme", nextProps.themes.value);
    }

    selectKey(event) {
        this.props.storeActiveTheme({
            value: parseInt(event.target.value, 10)
        });
        this.setState({
            selectedValue: event.target.value
        });
    }

    renderOptions() {
        return this.props.themes.array.map((theme, index) => {
            return <option key={index} value={index}>{theme}</option>;
        });
    }
    render()
    {
        return (
            <div className={"ThemeSwitch"}>
                <select
                    defaultValue={this.state.selectedValue}
                    onChange={this.selectKey}
                >
                    {this.renderOptions()}
                </select>
            </div>
        );
    }
}

export default ThemeSwitch;