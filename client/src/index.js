import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import createSagaMiddleware from 'redux-saga';

import './index.css';
import App from './app/containers/app';
import registerServiceWorker from './registerServiceWorker';
import reducers from './app/reducers/index';
import sagas from './app/sagas/index';
import socketMiddleware from './app/sockets/middleware';
import SocketClient from './app/sockets/index';
import config from './config/globalConfig';

const socketClient = new SocketClient();
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducers,
    applyMiddleware(
        sagaMiddleware,
        socketMiddleware
    )
);
sagaMiddleware.run(sagas);
registerServiceWorker();

render(
    (<Provider store={store} className={'wrapper'} >
        <App socket={socketClient} />
    </Provider>),
    document.getElementById('root')
);
