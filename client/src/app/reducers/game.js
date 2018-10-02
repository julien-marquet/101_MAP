import {
    GAME_PLAYER_POSITION_SET,
    GAME_PLAYER_CURRENT_MOVE
} from "../actions/bomberman";

const initialState = {
    position: null
};

const game = (state = initialState, {type, payload}) => {
    switch (type) {
    case GAME_PLAYER_POSITION_SET:
        return {
            ...state,
            position: payload
        };
    case GAME_PLAYER_CURRENT_MOVE:
        return {
            ...state,
            position: payload.newPos
        };
    default:
        return state;
    }
};

export default game;
