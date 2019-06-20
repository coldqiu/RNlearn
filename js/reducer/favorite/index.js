import Types from '../../action/types'

/***
 * favorite页面的数据格式
 * favorite: {
 *     popular: {
 *         projectModels: [],
 *         isLoading: false
 *     },
 *     trending: {
 *         projectModels: [],
 *         isLoading: false
 *     }
 * }
 */

const defaultState = {}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.FAVORITE_LOAD_DATA:
            return {
                ...state, // 生成state副本，或者 Object.assign代替
                [action.storeName]: { // 新的数据覆盖旧数据
                    ...state[action.storeName], // 下拉刷新要展示所有数据
                    projectModels: action.projectModels,
                    isLoading: true,
                }
            };

        case Types.FAVORITE_LOAD_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    isLoading: false,
                }
            };
        case Types.FAVORITE_LOAD_FAIL:
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
