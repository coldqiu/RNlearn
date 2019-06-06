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
 * state数，横向扩展
 * 如何动态设置store,和动态获取store(难点： storeName不固定);
 */

const defaultState = {
}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.LOAD_POPULAR_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    items: action.items,
                    isLoading: false,
                }
            };
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    items: action.items,
                    isLoading: true,
                }
            };
        case Types.LOAD_POPULAR_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    items: action.items,
                    isLoading: false,
                }
            };
        default:
            return state
    }
}
