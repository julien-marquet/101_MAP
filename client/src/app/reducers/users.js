import {USERS_GETTED, ACTIVE_USER_SWAP} from '../actions/users';

const initialState = {
    array: [],
    last_request: null,
    activeUser: {
        hostname: "z3r3p4",
        begin_at: new Date().toISOString(),
        id:5942728,
        user: {
            id:30890,
            login:"jfeve",
            url:"https://api.intra.42.fr/v2/users/ybarraul",
        }
    }
};

const users = (state = initialState, {type, payload}) => {
    switch (type) {
        case USERS_GETTED:
            return {
                ...state,
                ...payload
            }
        break ;
        case ACTIVE_USER_SWAP:
        console.log("swap", payload);
            return {
                ...state,
                activeUser: {
                    ...payload
                }
            }
        break ;
        default:
            return state;
        break ;
    }
}

export default users;
