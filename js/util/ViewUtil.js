import React from 'react'
import {TouchableOpacity, StyleSheet, View, Text, Button} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export  default class ViewUtil {
    /***
     * 获取组册返回按钮
     * @param callBack
     * @returns {XML}
     */
    static getLeftBackButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}
        >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />

        </TouchableOpacity>
    }

    static getShareButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}
        >
            <Ionicons
                name={'md-share'}
                size={20}
                style={{color: 'white', opacity: 0.9, marginRight: 10}}
            />

        </TouchableOpacity>
    }

    static getRightButton(title, callback) {
        return <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={callback}
        >
            <Text style={{fontSize: 20, color: '#FFFFFF', marginRight: 10}}>{title}</Text>
        </TouchableOpacity>
    }


    /***
     * 设置页面的Item
     * @param callback 点击item的回调
     * @param text
     * @param color 图标颜色
     * @param Icons react-native-vector-icons组件
     * @param icon 左侧图标
     * @param expandableIco 右侧图标
     * @return {XML} 返回个组件
     */
    static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
        return(
            <TouchableOpacity
                onPress={callback}
                style={styles.setting_item_container}
            >
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {Icons&&icon ?
                        <Icons
                            name={icon}
                            size={16}
                            style={{color: color, marginRight: 10}}
                        /> :
                        <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/> // 占位，没传Icons icon时显示
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginRight: 10,
                        alignSelf: 'center',
                        color: color || 'black',
                    }}
                />
            </TouchableOpacity>
        )
    }

    static getMenuItem(callback, menu, color, expandableIcon) {
        return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIcon)
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
})



