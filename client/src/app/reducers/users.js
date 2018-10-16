import {
    USERS_GETTED,
    ACTIVE_USER_SWAP,
    USER_GET_METADATA,
    USER_GET_METADATA_SUCCEEDED,
    USER_GET_METADATA_FAILED,
    USER_CLEAR_ACTIVE,
    USER_WHOAMI
} from "../actions/users";
import {SEARCH_UPDATE_CONTENT} from "../actions/search";
import {
    GAME_PLAYER_MOVE,
    GAME_PLAYER_FIRE,
    GAME_ENTITY_DELETE,
    GAME_ENTITIES_DELETE,
    GAME_ENTITIES_CREATE
} from "../actions/bomberman";

const initialState = {
    array: {},
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
    currentUser: {}
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
            activeUser: {...initialState.activeUser}
        };
    case USER_WHOAMI:
        return {
            ...state,
            currentUser: payload
        };
    // SAME
    case GAME_PLAYER_MOVE:
        return {
            ...state,
            array: {
                ...state.array,
                ...payload
            }
        };
    case GAME_PLAYER_FIRE:
        return {
            ...state,
            array: {
                ...state.array,
                ...payload
                // [payload]: [state.array[payload], {type: "bomb"}]
            }
        };
    case GAME_ENTITIES_CREATE:
        return {
            ...state,
            array: {
                ...state.array,
                ...payload
            }
        };
    case GAME_ENTITIES_DELETE:
        return {
            ...state,
            array: {
                ...state.array,
                ...payload
            }
        };
    // SAME
    case GAME_ENTITY_DELETE:
        return {
            ...state,
            array: {
                ...state.array,
                [payload]: undefined
            }
        };
    default:
        return state;
    }
};

export default users;
