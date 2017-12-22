const middleware = socket => {
    return ({dispatch, getState}) => next => action => {
        if (typeof action === "function") {
            return action(dispatch, getState);
        }
        const {promise, type, types, ...others} = action;
        if (type !== "socket" || !promise) {
            return next(action);
        }

        const [REQUEST, SUCCESS, FAILURE] = types;
        next({...others, type: REQUEST});
        return promise(socket)
            .then(result => next({...others, result, type: SUCCESS}))
            .catch(error => next({...others, error, type: FAILURE}));
    };
};

export default middleware;
