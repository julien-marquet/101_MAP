import {USERS_GETTED, ACTIVE_USER_SWAP, GET_USER_METADATA, GET_USER_METADATA_SUCCEEDED, GET_USER_METADATA_FAILED} from "../actions/users";

const initialState = {
    array: [],
    last_request: null,
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
    }
};

const users = (state = initialState, {type, payload}) => {
    switch (type) {
    case USERS_GETTED:
        return {
            ...state,
            ...payload
        };
    case ACTIVE_USER_SWAP:
        return {
            ...state,
            activeUser: {
                ...payload
            }
        };
    case GET_USER_METADATA:
        return {
            ...state,
            user_metadata: {
                ...state.user_metadata,
                success:null
            }
        };
    case GET_USER_METADATA_SUCCEEDED:
        return {
            ...state,
            user_metadata: {
                success: true,
                content: payload
            }
        };
    case GET_USER_METADATA_FAILED:
        return {
            ...state,
            user_metadata: {
                success: false,
                content: payload
            }
        };
    default:
        return state;
    }
};

export default users;
