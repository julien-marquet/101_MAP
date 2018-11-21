import {COALITIONS_GETTED} from "../actions/coalitions";

const initialState = {
    coalitions: []
};

const coalitions = (state = initialState, {type, payload}) => {
    switch (type) {
    case COALITIONS_GETTED:
        return {
            ...state,
            coalitions: [...Object.values(payload)]
        };
    default:
        return state;
    }
};

export default coalitions;
