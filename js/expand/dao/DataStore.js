import {AsyncStorage} from 'react-native'

export default class DataStore {
    fetchData(url) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).
            then((wrapData) => {
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData);
                    // console.log("fetchLocalData", wrapData);
                } else {
                    this.fetchNetData(url)
                        .then((data) => {
                            resolve(this._wrapData(data));
                        })
                        .catch((error) => {
                            reject(error);
                        })
                }
            }).catch((error) => {
                this.fetchNetData(url)
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
    fetchNetData(url) {
        return new Promise((resolve, reject) => {
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
