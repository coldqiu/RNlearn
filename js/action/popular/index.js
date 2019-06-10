import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

/***
 * 获取最热数据的异步action
 * @param storeName title 最热列表下哪一个tab下的数据，store key是变的
 * @param url
 * @returns {{type: string, theme: *}}
 */

export function onLoadPopularData(storeName, url) {
    // return {type: Types.THEME_CHANGE, theme: theme} // 不能使用同步的
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName})
        let dataStore = new DataStore();
        dataStore.fetchData(url) // 异步action与数据流
            .then(data => {
                handleData(dispatch, storeName, data)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: Types.LOAD_POPULAR_FAIL,
                    storeName,
                    error
                })
            })
    }
}

function handleData(dispatch, storeName, data) {
    dispatch({
        type: Types.LOAD_POPULAR_SUCCESS,
        items: data && data.data && data.data.items,
        storeName
    })
}

