import {USERS_GETTED} from '../actions/users';

const initialState = {
    array: [],
    last_request: null
};

const users = (state = initialState, {type, payload}) => {
    switch (type) {
        case USERS_GETTED:
            return {
                ...state,
                ...payload
            }
        default:
            return state;
    }
}

export default users;
