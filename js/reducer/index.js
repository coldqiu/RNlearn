import {combineReducers} from 'redux'
import theme from './theme'
import {rootCom, RootNavigator} from '../navigator/AppNavigators';
import popular from './popular'
import trending from './trending'

//1.指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));
// 上面这行代码搞什么啊，头晕，怎么来的，什么作用？？
// console.log("navState", navState);
// console.log("RootNavigator.router.getActionForPathAndParams('Init')", RootNavigator.router.getActionForPathAndParams('Init'));
/**
 * 2.创建自己的 navigation reducer，
 */
const navReducer = (state = navState, action) => {
    const nextState = RootNavigator.router.getStateForAction(action, state);
    // 如果`nextState`为null或未定义，只需返回原始`state`

    return nextState || state;
};


/**
 * 3.合并reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const index = combineReducers({
    nav: navReducer,
    theme: theme,
    popular: popular,
    trending: trending,
});

export default index;


