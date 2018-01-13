import React, {Component} from "react";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.updateSearch(event.target.value);
    }

    render() {
        return (
            <input
                className={"searchbar"}
                type={"text"}
                onChange={this.handleChange}
            />
        );
    }
}

export default SearchBar;
