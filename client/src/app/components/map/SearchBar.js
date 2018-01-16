import React, {Component} from "react";
import Autocomplete from "react-autocomplete";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.results = [];
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
            <div className={"searchBar"}>
                <Autocomplete
                    wrapperProps={{
                        className: "wrapperSearch",
                        style:{}
                    }}
                    renderMenu={(items, value) => {
                        if (items.length === 0 && value.length > 1) {
                            return (
                                <div className="searchResults">
                                    <div className="searchOption">No matches for {value}</div>
                                </div>);
                        } else {
                            return <div className="searchResults" children={items}/>;
                        }
                    }} 
                    open={this.props.searchedUser.length > 1 }
                    getItemValue={(item) => item.user.login}
                    items={this.getMatchingUsers()}
                    renderInput={(props) => <input placeholder={"Search"} {...props} />}
                    renderItem={(item, isHighlighted) =>
                        <div key={`item${item.id}`} class={isHighlighted ? "searchOption selected" : "searchOption"}>
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
