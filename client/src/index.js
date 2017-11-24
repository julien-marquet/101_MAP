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

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducers,
    applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas);
render(
    (<Provider store={store}>
        <App />
    </Provider>),
    document.getElementById('root')
);
registerServiceWorker();
