import {USERS_GETTED} from '../actions/users';

const initialState = {
    users: []
};

const users = (state = initialState, {type, payload}) => {
    console.log("HelloWorld", type);    
    switch (type) {
        case USERS_GETTED:
            return {
                ...state,
                users: payload
            }
        default:
            return state;
    }
}

export default users;
