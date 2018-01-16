import React, {Component} from "react";
import Autocomplete from "react-autocomplete";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.results = [];
        this.focusOut = null;
    }
    handleChange(event, value) {
        this.props.updateSearch(value);
        const perfectMatch = this.results.find(elem => elem.user.login === event.target.value);
        if (perfectMatch !== undefined)
            this.props.storeActiveUsers(perfectMatch);
    }
    handleSelection(value, item) {
        this.props.updateSearch(value);
        this.props.storeActiveUsers(item);
        this.focusOut.focus();
    }
    getMatchingUsers() {
        this.results = [];         
        Object.entries(this.props.users).forEach(value => {
            if (value[1].user.login.includes(this.props.searchedUser.toLowerCase()))
                this.results.push({
                    ...value[1],
                    hostname: value[0]
                });
        });
        return this.results;
    }
    render() {

        return (
            <div className={"searchBar"} ref={(item) => this.focusOut = item}>
                <Autocomplete
                    wrapperProps={{
                        className: "wrapperSearch",
                        style:{}
                    }}
                    renderMenu={(items) => {
                        return <div className="searchResults" children={items}/>;
                    }}
                    open={this.props.searchedUser.length > 2}
                    getItemValue={(item) => item.user.login}
                    items={this.getMatchingUsers()}
                    renderItem={(item, isHighlighted) =>
                        <div key={`item${item.id}`} style={{ background: isHighlighted ? "lightgray" : "white" }}>
                            {item.user.login}
                        </div>
                    }
                    value={this.props.searchedUser}
                    onChange={this.handleChange}
                    onSelect={this.handleSelection}
                />
            </div>
        );
    }
}

export default SearchBar;
