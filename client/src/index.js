import React from "react";
import {createStore} from "redux";
import {render} from "react-dom";
import {Provider} from "react-redux";

import "./index.css";
import App from "./app/containers/app";
import registerServiceWorker from "./registerServiceWorker";
import reducers from "./app/reducers/index";
import SocketClient from "./app/sockets/index";

const socketClient = new SocketClient();
const store = createStore(reducers);
registerServiceWorker();

render(
    (<Provider store={store} className={"wrapper"} >
        <App socket={socketClient} />
    </Provider>),
    document.getElementById("root")
);
