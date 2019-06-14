import Types from "./types";

export function handleData(actionType, dispatch, storeName, data, pageSize) {
    // console.log("似乎没有进入这个函数？")
    let fixItems = [];
    if (data && data.data) { // popular 和 trending 的数据结构略有不同
        if (Array.isArray(data.data)) {
            fixItems = data.data // trending
        } else if (Array.isArray(data.data.items)){
            fixItems = data.data.items // popular
        }
    }

    dispatch({
        type: actionType,
        // items: data && data.data && data.data.items,
        items: fixItems,
        projectModes: pageSize > fixItems.length ? fixItems: fixItems.slice(0, pageSize),// 第一次要加载的数据
        storeName,
        pageIndex: 1 // 第一次加载 pageIndex = 1
    })
}
