import Types from '../../action/types'

/***
 * store树的结构设计
 * popular: {
 *     java: {
 *         items: [],
 *         isLoading: false
 *     },
 *     ios: {
 *         items: [],
 *         isLoading: false
 *     }
 * }
 * state数，横向扩展 store key是变的
 * 如何动态设置store,和动态获取store(难点： storeName不固定);
 * 所以就以下设计 ： [action.storeName] 动态store key
 *  case Types.LOAD_POPULAR_SUCCESS:
        return {
                ...state, // 生成state副本
                [action.storeName]: { // 新的数据覆盖旧数据
                    ...[action.storeName],
                    items: action.items,
                    isLoading: false,
                }
            };
 */

const defaultState = {
}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.LOAD_POPULAR_SUCCESS:
            console.log("action", action);
            return {
                ...state, // 生成state副本
                [action.storeName]: { // 新的数据覆盖旧数据
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: false,
                }
            };
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: true,
                }
            };
        case Types.LOAD_POPULAR_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }
            };
        default:
            return state
    }
}
