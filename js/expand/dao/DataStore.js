import {AsyncStorage} from 'react-native'
import Trending from 'GitHubTrending'

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}
export default class DataStore {
    fetchData(url, flag) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).
            then((wrapData) => {
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData);
                    // console.log("fetchLocalData", wrapData);
                } else {
                    this.fetchNetData(url, flag)
                        .then((data) => {
                            resolve(this._wrapData(data));
                        })
                        .catch((error) => {
                            reject(error);
                        })
                }
            }).catch((error) => {
                this.fetchNetData(url, flag)
                    .then((data) => {
                        // console.log("fetchNetData", this._wrapData(data));
                        resolve(this._wrapData(data));
                    })
                    .catch((error) => {
                        reject(error);
                    })
            })
        })
    }
    saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }

    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()}
    }

    /***
     * @param url
     * @return {Promise}
     */
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        // console.log("fetchLocalData", url)
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(e);
                }
            })
        })
    }

    /***
     * 获取网络数据
     * @param url
     * @return {Promsie}
     */
    fetchNetData(url, flag) {
        return new Promise((resolve, reject) => {
            if (flag !== FLAG_STORAGE.flag_trending) {
                fetch(url)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error ('Network Wrong')
                    })
                    .then((responseData) => {
                        // console.log("fetchNetData", responseData)
                        this.saveData(url, responseData)
                        resolve(responseData);
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                new Trending().fetchTrending(url)
                    .then(items=>{
                        if (!items) {
                            throw new Error('responseData is null')
                        }
                        this.saveData(url, items);
                        resolve(items);
                    })
                    .catch(error=> {
                        reject(error)
                    })
            }
        })
    }

    /***
     * 检查timestamp 是否在有效期内
     * @param timestamp 项目更新时间
     * @returns {boolean} true 不需要更新 false 需要更新
     */
    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        // if (currentDate.getHours() - targetDate.getHours() > 4) return false;//有效期4个小时
        return true;
    }
}
