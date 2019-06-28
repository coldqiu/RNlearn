import React, {Component} from 'react';
import {StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator, DeviceInfo, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';
import {connect} from 'react-redux'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, {TimeSpans} from "../common/TrendingDialog";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import NavigationUtil from '../navigator/NavigationUtil'
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteDao from '../expand/dao/FavoriteDao'
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from '../util/ArrayUtil'

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending); //

const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE"
const URL = 'https://github.com/trending/'
const QUERY_STR = '?since=daily'
const THEME_COLOR = '#678'
type Props = {};
class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        // this.tabNames = ['All', 'JavaScript', 'C', 'Python'];
        this.state = {
            timeSpan: TimeSpans[0]
        }
        const {onLoadLanguage} = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
        this.preKeys = []
        console.log("this.props-TrendingPage", this.props)
    }
    _genTabs() {
        const {keys} = this.props // 执行了onLoadLanguage() 将获取的数据放入了props?
        console.log("_genTabs:",keys)
        const tabs = {};
        this.preKeys = keys
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTabPage {...props} tabLabel={item.name} timeSpan={this.state.timeSpan}/>,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs;
    }

    renderTitleView() {
        return <View>
            <TouchableOpacity
                underlayColor='transparent'
                onPress={() =>  this.dialog.show()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#ffffff',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
    }
    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog=> this.dialog=dialog}
            onSelect={tab=>this.onSelectTimeSpan(tab)}
        />
    }
    _tabNav() {
        if (!this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(
                this._genTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false, // 是否使用标签大写，默认为true
                        scrollEnabled: true, // 是否支持 选项卡滚动，默认false
                        style: {
                            backgroundColor: '#678', // tabBar的背景颜色
                            height: 30 // fix 开启scrollEnabled后在Android 上初次加载时闪烁问题

                        },
                        indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
                        labelStyle: styles.labelStyle // 文字的样式
                    }
                }
            ))
        }
        return this.tabNav;
    }
    render() {
        const {keys} = this.props
        console.log("this.props.at.render()", this.props)
        console.log("keys", keys)
        let statusBar = {
            backGroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = keys.length ? this._tabNav() : null;
        return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
            {navigationBar}
            {TabNavigator &&  <TabNavigator/>}
            {this.renderTrendingDialog()}
        </View>
    }
}
const mapTrendingStateToProps = state => ({
    // keys: state.language.languages
    // state 是？
    keys: state.language.languages
})
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage)


const pageSize = 10
class TrendingTab extends Component<Props> {
    // 绑定：订阅popular的action 中的store
    constructor(props) {
        super(props);
        const {tabLabel, timeSpan} = this.props; // 就是最热列表页的Tab名称
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
    }
    componentDidMount() {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, timeSpan => {
            this.timeSpan = timeSpan;
            this.loadData();
        })
    }
    componentWillUnmount() {
        if (this.timeSpanChangeListener) { // 及时释放资源
            this.timeSpanChangeListener.remove();
        }
    }
    loadData(loadMore) {
        const {onRefreshTrending, onLoadMoreTrending} = this.props;
        const url = this.genFetchUrl(this.storeName)
        const store = this._store()
        if (loadMore) { // 根据loadMore 判断执行哪一action
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback=> {
                this.refs.toast.show('没有更多了')
            })

        } else {
            onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
        }
    }
    genFetchUrl(KEY) {
        // console.log("this.timeSpan", this.timeSpan)
        return URL + KEY + '?' + this.timeSpan.searchText;
    }
    _store() {
        const {trending} = this.props; // 这个popular是mapStateToProps传进来的
        let store = trending[this.storeName]; // 动态获取state
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [], // 要显示的数据
                hideLoadingMore: true, // 默认隐藏加载更多
            }
        }
        return store;
    }

    renderItem(data) {
        // 在FlatList组件中作为renderItem
        const item = data.item;
        // console.log("data-renderItem", data)
        // console.log("item-renderItem", item)
        return <TrendingItem
            projectModel={item}
            onSelect={(callback)=> {
                NavigationUtil.goPage({
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
        />
    }
    genIndicator() {
        return this._store().hideLoadingMore ? null:
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }
    render() {
        let store = this._store();
        // const {tabLabel} = this.props
        // // 刷新也会把所有的Tab都执行一遍
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data=>this.renderItem(data)}
                    keyExtractor={item=> "" + (item.item.id || item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            refreshing={store.isLoading} // 是否显示
                            onRefresh={() => this.loadData()}
                            tintColor={[THEME_COLOR]}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => { // 当列表滚动到底部会执行这个方法
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                console.log("!!!!!onEndReached!!!!!!")
                                this.loadData(true)
                                this.canLoadMore= false
                            }
                        }, 100)
                        // 快速上滑是有问题的！！
                        // FlatList  滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true
                        console.log("!!!!!!onMomentumScrollBegin!!!!!!")
                    }}
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    trending: state.trending
})
const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback))
})

// 使用connect 将popularTab和store关联起来
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)
// connect只是一个函数，并不一定要放在export后面

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        // minWidth: 50, // 顶部导航宽度导致 初次加载闪烁问题
        padding: 0,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    labelStyle: {
        fontSize: 13,
        margin: 0,
    },
    indicator: {
        margin: 10,
        color: 'red',
    },
    indicatorContainer: {
        alignItems: 'center',
    }
});
