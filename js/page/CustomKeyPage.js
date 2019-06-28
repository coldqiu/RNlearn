import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator, DeviceInfo, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil'
import {connect} from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationBar from '../common/NavigationBar'
import FavoriteUtil from '../util/FavoriteUtil'
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteDao from '../expand/dao/FavoriteDao'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
import ArrayUtil from "../util/ArrayUtil";


const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular); // FLAG_STORAGE.flag_popular = 'popular'
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=star'
const THEME_COLOR = '#678'
type Props = {};
class CustomKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
        this.changeValues = []; // 保存被勾选的数据
        this.isRemoveKey = !!this.params.isRemoveKey;  //标识：是否是标签移除页， 为啥是 !! 操作
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            keys: []
        }
    }
    // getDerivedStateFromProps 这个方法的功能？
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState)
            }
        }
        return null
    }
    /**
     * 获取标签
     * @param props
     * @param original 移除标签时使用，是否从props获取原始对的标签？
     * @param state 移除标签时使用
     * @private
     */
    static _keys(props, original, state) {
        // flag 标识模块： “最热” “趋势”； isRemoveKey 是否是移除标签
        const {flag, isRemoveKey} = props.navigation.state.params // this.params?
        let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
        if (isRemoveKey && !original) {
            // 移除标签不需要原数据, original 是原数据
        } else {
            return props.language[key] // 自定义标签，自定义语言；执行这条语句
        }
    }
    onBackPress(e) {
        this.onBack()
        return true
    }
    componentDidMount() {
        this.backPress.componentDidMount();
        // 如果props中标签为空则从本地存储中获取标签
        if (CustomKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props
            onLoadLanguage(this.params.flag)
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props)
        })
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }
    onSave() {
        // 保存变更
        console.log("this.changeValues-onSave", this.changeValues)
        if (this.changeValues.length === 0) {
            NavigationUtil.goBack(this.props.navigation)
            console.log("sssss")
            return
        }
        this.languageDao.save(this.state.keys)
        // 更新 store 使得’最热or趋势模块的的数据更新
        const {onLoadLanguage} = this.props
        onLoadLanguage(this.params.flag)
        // this.changeValues = [] // 保存成功后应清空this.changeValues,不用这一步操作，每次如这个页面都会在constructor()初始化？？
        NavigationUtil.goBack(this.props.navigation)
    }
    onClick(data, index) {
        console.log("this.changeValues-onClick-before", this.changeValues)
        // 改变收藏状态, 需要维护一个用户点击后的checked数据
        data.checked = !data.checked
        ArrayUtil.updataArray(this.changeValues, data) // 修改this.changeValues
        console.log("this.state.keys", this.state.keys)
        this.state.keys[index] = data
        this.setState({
            keys: this.state.keys
        })
        console.log("this.changeValues-onClick-after", this.changeValues)
    }
    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗？', [
                {
                  text: '否', onPress: () => {NavigationUtil.goBack(this.props.navigation)}
                },
                {
                    text: '是', onPress: () => {this.onSave()}
                }
            ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    renderView() {
        let dataArray = this.state.keys
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = []
        for (let i = 0, l = len; i < l; i +=2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i+1], i+1)}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        return views
    }
    _checkedImage(checked) {
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{color: '#3482e6'}}
        />
    }
    renderCheckBox(data, index) {
        return <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={() => this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }
    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签'
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
        let rightButtonTitle = this.isRemoveKey ? '移除': '保存'
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
        />
        return <View style={styles.container}>
            {navigationBar}
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>
    }
}

const mapPopularStateToProps = state => ({
    language: state.language
})
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: 'row'
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    }
});
