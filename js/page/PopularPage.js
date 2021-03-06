import React, {Component} from 'react';
import {StyleSheet, Text, View, RefreshControl, FlatList, ActivityIndicator, DeviceInfo} from 'react-native';
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


const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular); // FLAG_STORAGE.flag_popular = 'popular'
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=star'
const THEME_COLOR = '#678'
type Props = {};
class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        // this.tabNames = ['JavaScript', 'Android', 'React', 'Webpack', 'React Native'];
        const {onLoadLanguage} = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_key)
        // console.log("this.props-PopularPage", this.props)

    }
    _genTabs() {
        const tabs = {};
        const {keys} = this.props // 执行了onLoadLanguage() 将获取的数据放入了props?
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTabPage {...props} tabLabel={item.name}/>,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs;
    }

    render() {
        const {keys} = this.props
        // console.log("keys", keys)
        let statusBar = {
            backGroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
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
                },
                lazy: true // 懒加载每次只加载一个Tab页面
            }
        )) : null


        return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
            {navigationBar}
            {TabNavigator && <TabNavigator/>}
        </View>
    }
}

const mapPopularStateToProps = state => ({
    // keys: state.language.keys
    keys: state.language.keys
})
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)

const pageSize = 10
class PopularTab extends Component<Props> {
    // 绑定：订阅popular的action 中的store
    constructor(props) {
        super(props);
        const {tabLabel} = this.props; // 就是最热列表页的Tab名称
        this.storeName = tabLabel;
        // console.log("this.is.PopularTab.constructor.this.storeName", this.storeName);
        this.isFavoriteChanged = false;
    }
    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangListener =() => {
            this.isFavoriteChanged = true;
            console.log("favorite_changed_popular")
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 0 && this.isFavoriteChanged) {
                // this.loadData(null, true);
                // console.log("bottom_tab_select",this.loadData)
                const temp = this.loadData(false, true)
                console.log("temp", temp)
                const {onFlushPopularFavorite} = this.props;
                const store = this._store()
                onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
            }
        })
    }
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangListener)
        EventBus.getInstance().removeListener(this.bottomTabSelectListener)
    }
    loadData(loadMore, refreshFavorite) { // refreshFavorite  作为刷新收藏状态的标志位
        const {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} = this.props;
        const url = this.genFetchUrl(this.storeName)
        const store = this._store()
        // console.log("this.storeName", this.storeName)
        // onLoadPopularData(this.storeName, url); // 这样调用是因为 这个页面已经
        const {popular} = this.props;
        // console.log("popular-in-loadData-function", popular);
        // 使用mapDispatchToProps添加了获取数据dispatch方法，否则还可以这样获取数据：
        // const {dispatch} = this.props
        // dispatch(actions.onLoadPopularData(this.storeName, url))
        //
        // onLoadPopularData: (storeName, url, pageSize) => dispatch(actions.onLoadPopularData(storeName, url, pageSize)),
        // onLoadMorePopular: (storeName, url, pageIndex, pageSize, items, callback) => dispatch(actions.onLoadMorePopular(storeName, url, pageIndex, pageSize, items, callback))
        console.log("refreshFavorite", refreshFavorite)
        if (loadMore) { // 根据loadMore 判断执行哪一action
            console.log("loadMore")
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if (refreshFavorite) {
            // debugger
            console.log("before --onFlushPopularFavorite,")
            // storeName, pageIndex, pageSize, items, favoriteDao
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)

        } else {
            onLoadPopularData(this.storeName, url, pageSize, favoriteDao)
        }

    }
    genFetchUrl(KEY) {
        return URL + KEY + QUERY_STR;
    }
    _store() {
        const {popular} = this.props; // 这个popular是mapStateToProps传进来的
        // console.log("this.storeName-always", this.storeName); // 这个render在初始化是多次执行,但是这刷新页面时，这个也执行了多次
        let store = popular[this.storeName]; // 动态获取state
        // console.log("store-always", store);
        // 在JavaScript 页下拉时，这部分代码依然会被循环执行5次，
        // 最有的this.storeName 不是JavaScript!!
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

        return <PopularItem
            projectModel={item}
            onSelect={(callback)=> {
                NavigationUtil.goPage({
                    projectModel: item, // 详情页还没准备好接受有isFavorite字段的对象
                    // projectModel: item
                    flag: FLAG_STORAGE.flag_popular,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, this.storeName)}
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
        // console.log("store", store)
        // console.log("store.projectModel", store.projectModels)

        // const {tabLabel} = this.props
        // // 刷新也会把所有的Tab都执行一遍

        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data=>this.renderItem(data)}
                    keyExtractor={item=> "" + item.item.id} // 第一个item是projectModel
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
                               // console.log("!!!!!onEndReached!!!!!!")
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
                        // console.log("!!!!!!onMomentumScrollBegin!!!!!!")
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
    popular: state.popular
})
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadPopularData(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
})

// 使用connect 将popularTab和store关联起来
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)
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
