import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {handleData, _projectModels} from "../ActionUtil";

/***
 * 获取最热数据的异步action,下拉刷新
 * @param storeName title 最热列表下哪一个tab下的数据，store key是变的
 * @param url
 * @param pageSize 每一页显示的数量
 * @returns
 */

export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
    // return {type: Types.THEME_CHANGE, theme: theme} // 不能使用同步的
    // console.log("onLoadPopularData-function-insider", storeName)
    // console.log("onLoadPopularData-function-insider", url)
    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName})
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // 异步action与数据流
            .then(data => {
                handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                })
            })
    }
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @returns {function(*)}
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
    return dispatch => {
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray,
                })
            } else {
                //本次和载入的最大数量
                // console.log("dataArray", dataArray)
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                // dispatch({
                //     type: Types.TRENDING_LOAD_MORE_SUCCESS,
                //     storeName,
                //     pageIndex,
                //     projectModes: dataArray.slice(0, max),
                // })
                _projectModels(dataArray.slice(0, max), favoriteDao, data=>{
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: data,
                    })
                })
            }
        }, 500);
    }
}
