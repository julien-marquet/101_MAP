import {connect} from "react-redux";

import SearchBar from "../../components/map/SearchBar";
import {SEARCH_UPDATE_CONTENT} from "../../actions/search";
import {ACTIVE_USER_SWAP} from "../../actions/users";


const mapStateToProps = ({users, globalState}) => {
    return {
        users: users.array,
        searchedUser: users.searchedUser,
        mode: globalState.mode
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateSearch: content => dispatch({type: SEARCH_UPDATE_CONTENT, payload: {content}}),
        storeActiveUsers: payload => dispatch({type: ACTIVE_USER_SWAP, payload})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
