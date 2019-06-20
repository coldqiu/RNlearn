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

const defaultState = {}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.TRENDING_REFRESH_SUCCESS:
            return {
                ...state, // 生成state副本，或者 Object.assign代替
                [action.storeName]: { // 新的数据覆盖旧数据
                    ...state[action.storeName], // 下拉刷新要展示所有数据
                    items: action.items, // 原始数据
                    projectModels: action.projectModels,
                    isLoading: false,
                    hideLoadingMore: false, // 不隐藏加载更多
                    pageIndex: action.pageIndex,
                }
            };

        case Types.TRENDING_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items,
                    isLoading: true,
                    hideLoadingMore: true,
                }
            };
        case Types.TRENDING_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }
            };
        case Types.TRENDING_LOAD_MORE_SUCCESS: // 下拉加载更多成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    hideLoadingMore: false, // 不隐藏加载跟多
                    pageIndex: action.pageIndex,

                }
            };
        case Types.TRENDING_LOAD_MORE_FAIL: // 下拉加载更多成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                }
            };
        default:
            return state

    }
}
