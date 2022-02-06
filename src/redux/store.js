import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducers from './modules';

const configureStore = (reducers = {}, preloadedState = {}, middlewares = []) => createStore(
    combineReducers ({
        ...rootReducers,
        ...reducers
    }),
    preloadedState,
    compose(
        applyMiddleware(
            ...middlewares,
            thunk
        )
    )
);

export default configureStore;