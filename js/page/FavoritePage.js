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
import TrendingItem from '../common/TrendingItem'
import EventBus from 'react-native-event-bus' // 功能与RN自带的Device..相似
import EventTypes from '../util/EventTypes'

const THEME_COLOR = '#678'
type Props = {};
export default class FavoritePage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['最热', '趋势'];
    }

    render() {
        let statusBar = {
            backgroundColor : THEME_COLOR,
            barStyle: 'light-content',
        }
        let navigationBar = <NavigationBar
            title={'收藏'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
            'Popular': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
                navigationBar: {
                    title: '最热'
                }
            },
            'Trending': {
                screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
                navigationBar: {
                    title: '趋势'
                }
            }
        }, {
            tabBarOptions: {
                tabStyle: styles.tabStyle,
                upperCaseLabel: false,
                style: {
                    backgroundColor: '#678',
                    height: 30
                },
                indicatorStyle: styles.indicatorStyle,
                labelStyle: styles.labelStyle,
            }
        }))
        return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
            {navigationBar}
            <TabNavigator/>
        </View>
    }
}
class FavoriteTab extends Component<Props> {
    // 绑定：订阅popular的action 中的store
    constructor(props) {
        super(props);
        const {flag} = this.props; // 就是最热列表页的Tab名称
        this.storeName = flag;
        this.favoriteDao = new FavoriteDao(flag)

    }
    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data =>{
            if (data.to === 2) {
                this.loadData(false)
            }
        })
    }
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener)
    }
    loadData(isShowLoading) {
        const {onLoadFavoriteData} = this.props;
        onLoadFavoriteData(this.storeName, isShowLoading)
        console.log("isShowLoading", isShowLoading)
    }
    _store() {
        // console.log("this.props", this.props)
        const {favorite} = this.props;
        let store = favorite[this.storeName]; // 动态获取state
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [], // 要显示的数据
            }
        }
        return store;
    }
    // onFavorite(item, isFavorite) {
        // FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
        // if (this.storeName === FLAG_STORAGE.flag_popular) {
        //     EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
        // } else {
        //     EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending);
        // }

        // onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, this.storeName)}

    // }
    renderItem(data) {
        const favoriteDao = this.favoriteDao
        console.log("fav", favoriteDao)
        const item = data.item;
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
        return <Item
            projectModel={item}
            onSelect={(callback)=> {
                NavigationUtil.goPage({
                    projectModel: item,
                    flag: this.storeName,
                    callback
                }, 'DetailPage')
            }}
            // onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, this.storeName)}

        />
    }
    render() {
        // debugger
        let store = this._store();

        // console.log("store", store)
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
                            onRefresh={() => this.loadData(true)}
                            tintColor={[THEME_COLOR]}
                        />
                    }
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
    favorite: state.favorite
})
const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
})

// 使用connect 将popularTab和store关联起来
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)
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
