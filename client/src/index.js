import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import createSagaMiddleware from "redux-saga";
import {
    createStore,
    applyMiddleware,
    compose
} from "redux";

import "./index.css";
import App from "./app/containers/app";
import {unregister} from "./registerServiceWorker";
import reducers from "./app/reducers/index";
import sagas from "./app/sagas/index";
import SocketClient from "./app/sockets/index";

const socketClient = new SocketClient();
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(sagas, socketClient, store.dispatch);
unregister();

render(
    (<Provider store={store} className={"wrapper"} >
        <App socket={socketClient} />
    </Provider>),
    document.getElementById("root")
);
