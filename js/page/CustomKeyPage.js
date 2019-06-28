import React, {Component} from 'react';
import {StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator, DeviceInfo, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil'
import {connect} from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
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
        this.changeValues = []; // 保存被勾线的数据
        this.isRemoveKey = !!this.params.isRemoveKey;  //标识：是否是标签移除页， 为啥是 !! 操作
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            keys: []
        }
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
    }
    renderView() {
        let dataArray = this.state.keys
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = []
        for (let i = 0, l = len; i < l; i +=2) {
            views.push(
                <View keys={i}>
                    <View style={styles.item}>
                        <View style={styles.line}/>
                    </View>
                </View>
            )
        }
    }
    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签'
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
        let rightButtonTitle = this.isRemoveKey ? '移除': '保存'
        let navigationBar = <NavigationBar
            title={title}
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
    }
});
