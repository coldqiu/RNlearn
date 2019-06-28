import {AsyncStorage,} from 'react-native';
import langs from '../../res/data/langs.json';
import keys from '../../res/data/keys.json';

// keys 是一个数组，每个元素的是一个对象，最热模块的标签数据
// {
//     "path": "stars:>1",
//     "name": "ALL",
//     "short_name": "ALL",
//     "checked": true // 是否选中
// }

// langs 是为趋势模块准备的
// {
//     "path": "",
//     "name": "All Language",
//     "short_name": "All",
//     "checked": true // 是否选中
// }
export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'}

export default class LanguageDao {
    // 通过LanguageDao 动态的设置上面的数据的加载
    // “最热”模块的的标签，“趋势”模块的语言，两者都是由LanguageDao 动态设置的
    constructor(flag) {
        this.flag = flag // 用于标识 “最热:flag_key” “趋势：flag_language”
    }
    /***
     * 获取语言或标签
     * @returns {Promise<any> | Promise}
     */
    // fetch　获取两个模块要显示的数据
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error)
                    return
                }
                if (!result) {
                    let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys
                    // 将本地文件数据保存到AsyncStorage
                    this.save(data);
                    resolve(data);
                } else {
                    try {
                        resolve(JSON.parse(result)) // json数据解析成对象返回
                    }
                    catch (e) {
                        reject(e)
                    }
                }
            })
        })
    }
    /**
     * 保存语言或标签
     * 将数据序列化
     * @param objectData
     */
    save(objectData) {
        let stringData = JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag, stringData, (error, result) => {

        });
    }
}
