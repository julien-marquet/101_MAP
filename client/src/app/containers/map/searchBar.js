import {connect} from "react-redux";

import SearchBar from "../../components/map/SearchBar";
import {SEARCH_UPDATE_CONTENT} from "../../actions/search";

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        updateSearch: content => dispatch({type: SEARCH_UPDATE_CONTENT, payload: {content}})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
