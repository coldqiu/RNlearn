export default class ArrayUtil {
    /**
     * 判断两个数组是否‘相等’
     * 数组长度相等且对应元素相等
     */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false;
        if (arr1.length !== arr2.length) return false;
        for (let i = 0, l = arr1.length; i < l; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    /**
     * 更新数组，若item已存，则将其从数组中删除，反之将其添加的到数组中
     * @param array
     * @param item
     */
    static updataArray(array, item) {
        for (let i = 0, len = array.length; i < len; i++) {
            let temp = array[i]
            if (item === temp) {
                array.splice(i, 1)
                return
            }
        }
        array.push(item)
    }
}
