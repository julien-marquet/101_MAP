import React, {Component} from "react";
import PropTypes from "prop-types";
import Autocomplete from "react-autocomplete";

import globalConfig from "../../../config/globalConfig";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.results = [];

        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    handleChange(event, value) {
        this.props.updateSearch(value);
        const perfectMatch = this.results.find(elem => elem.login === event.target.value);
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
            if (value[1].login.includes(this.props.searchedUser.toLowerCase()))
                this.results.push({
                    ...value[1],
                    hostname: value[0]
                });
        });
        return this.results;
    }

    render() {
        return (
            <div className={this.props.mode === "passive" ? "searchBar searchBarHided" : "searchBar"}>
                <Autocomplete
                    wrapperProps={{
                        className: "wrapperSearch",
                        style:{}
                    }}
                    renderMenu={(items, value) => {
                        if (items.length === 0 && value.length >= globalConfig.minimalSearchInput) {
                            return (
                                <div className="searchResults">
                                    <div className="searchOption">No matches for {value}</div>
                                </div>);
                        } else {
                            return <div className="searchResults" children={items}/>;
                        }
                    }} 
                    open={this.props.searchedUser.length >= globalConfig.minimalSearchInput}
                    getItemValue={(item) => item.login}
                    items={this.getMatchingUsers()}
                    renderInput={(props) => <input placeholder={"Search"} {...props} />}
                    renderItem={(item, isHighlighted) =>
                        <div key={`item${item.id}`} className={isHighlighted ? "searchOption selected" : "searchOption"}>
                            {item.login}
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

SearchBar.propTypes = {
    storeActiveUsers: PropTypes.func.isRequired,
    updateSearch: PropTypes.func.isRequired,
    searchedUser: PropTypes.string
};

export default SearchBar;
