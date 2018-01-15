import React, {Component} from "react";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.renderDataList = this.renderDataList.bind(this);
        this.results = [];
    }
    handleChange(event) {
        this.props.updateSearch(event.target.value);
        const perfectMatch = this.results.find(elem => elem.user.login === event.target.value);
        if (perfectMatch !== undefined)
            this.props.storeActiveUsers(perfectMatch);
        
    }
    renderDataList() {
        this.results = [];         
        if (this.props.users.length !== 0 && this.props.searchedUser.length > 0) {
            Object.entries(this.props.users).forEach(value => {
                if (value[1].user.login.includes(this.props.searchedUser.toLowerCase()))
                    this.results.push({
                        ...value[1],
                        hostname: value[0]
                    });
            });
            return (
                <datalist id={"searchUsers"}>
                    {
                        this.results.map((user, index) => {
                            return (
                                <option key={`searchResult-${index}`} value={user.user.login} className={"searchResultNode"} />
                            );
                        })
                    }
                </datalist>
            );
        }
    }
    render() {
        return (
            <div className={"searchBar"}>
                <input
                    type={"text"}
                    list={"searchUsers"}
                    key={"searchInput"}
                    type={"text"}
                    className={"searchbar"}
                    placeholder={"Search..."}
                    onChange={this.handleChange}
                    value={this.props.searchedUser}

                />
                {this.renderDataList()}
            </div>
        );
    }
}

export default SearchBar;
