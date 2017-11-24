import React from 'react';
import {createStore} from 'redux';
import {render} from 'react-dom';
import {Provider} from 'react-redux'

import './index.css';
import App from './app/containers/app';
import registerServiceWorker from './registerServiceWorker';
import reducers from './app/reducers/index';

const store = createStore(reducers);
render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
