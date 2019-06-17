import ProjectModel from '../model/ProjectModel'
import　Utils from '../util/Utils'

export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao, params) {
    // console.log("似乎没有进入这个函数？")
    // 对数据的格式做微调，并触发dispatch
    let fixItems = [];
    if (data && data.data) { // popular 和 trending 的数据结构略有不同
        if (Array.isArray(data.data)) {
            fixItems = data.data // trending
        } else if (Array.isArray(data.data.items)){
            fixItems = data.data.items // popular
        }
    }
    let showItems =  pageSize > fixItems.length ? fixItems: fixItems.slice(0, pageSize)// 第一次要加载的数据
    // 这是原始的数据，需要把isFavorite 字段手动添加上去
    _projectModels(showItems,favoriteDao,projectModels=>{
        dispatch({
            type: actionType,
            items: fixItems,
            projectModels:projectModels,
            storeName,
            pageIndex: 1,
            ...params
        })
    });
    // dispatch({
    //     type: actionType,
    //     // items: data && data.data && data.data.items,
    //     items: fixItems,
    //     projectModes: pageSize > fixItems.length ? fixItems: fixItems.slice(0, pageSize),// 第一次要加载的数据
    //     storeName,
    //     pageIndex: 1 // 第一次加载 pageIndex = 1
    // })
}



/**
 * 通过本地的收藏状态包装Item，添加字段isFavorite
 * @param showItems
 * @param favoriteDao
 * @param callback
 * @returns {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
    let keys = [];
    try {
        //获取收藏的key
        keys = await favoriteDao.getFavoriteKeys();
    } catch (e) {
        console.log('e', e);
    }
    let projectModels = [];
    for (let i = 0, len = showItems.length; i < len; i++) {
        projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
    }
    doCallBack(callback,projectModels);
}
export const doCallBack = (callBack, object) => {
    if (typeof callBack === 'function') {
        callBack(object);
    }
};
