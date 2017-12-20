import {USERS_GETTED, ACTIVE_USER_SWAP} from '../actions/users';
import Moment from 'moment';

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
