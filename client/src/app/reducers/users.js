import {
    USERS_GETTED,
    USER_ACTIVE_SWAP,
    USER_GET_METADATA,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED,
    USER_CLEAR_ACTIVE
} from "../actions/users";
import {SEARCH_UPDATE_CONTENT} from "../actions/search";

const initialState = {
    array: [],
    last_request: null,
    nb_connected_users: 0,
    inPoolNbr: 0,
    activeUser: {
        hostname: null,
        begin_at: null,
        id: 0,
        user: {
            id: 0,
            login: null,
            url: null,
        }
    },
    user_metadata: {
        success: null,
        content: null
    },
    searchedUser: "",
    coalitions: []
};

const users = (state = initialState, {type, payload}) => {
    switch (type) {
    case USERS_GETTED:
        return {
            ...state,
            ...payload
        };
    case USER_ACTIVE_SWAP:
        return {
            ...state,
            searchedUser: initialState.searchedUser,
            activeUser: {
                ...payload
            }
        };
    case USER_GET_METADATA:
        return {
            ...state,
            user_metadata: {
                ...state.user_metadata,
                success:null
            }
        };
    case USER_GET_METADATA_SUCCEEDED:
        if (state.activeUser.user.id === payload.id) {
            return {
                ...state,
                user_metadata: {
                    success: true,
                    content: payload
                }
            };
        }
        else {
            return state;
        }
    case USER_GET_METADATA_FAILED:
        return {
            ...state,
            user_metadata: {
                success: false,
                content: payload
            }
        };
    case SEARCH_UPDATE_CONTENT:
        return {
            ...state,
            searchedUser: payload.content
        };
    case USER_CLEAR_ACTIVE:
        return {
            ...state,
            activeUser: {...initialState.activeUser},
            user_metadata: {...initialState.user_metadata}
        };
    default:
        return state;
    }
};

export default users;
