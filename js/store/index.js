import {applyMiddleware, createStore} from 'redux'
import reducers from '../reducer'
import {middleware} from '../navigator/AppNavigators'



const middlewares = [
    middleware,
];

/**
 * 创建store
 */
export default createStore(reducers, applyMiddleware(...middlewares));
