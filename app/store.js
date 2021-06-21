import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { rootReducer } from './rootReducer';
import rootSaga from './saga';

// Add support of REDUX_DEVTOOLS_EXTENSION in chrome
const composeEnhancers =
  (typeof window !== 'undefined' &&
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const logger = createLogger({});

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
  /**
   * Add logger for development only environment
   */
  middlewares.push(logger);
}

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);
