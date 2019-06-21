import React, {Component} from 'react';
import {
    createBottomTabNavigator,
    createAppContainer,
    BottomTabBar
} from "react-navigation"
import PopularPage from "../page/PopularPage";
import TrendingPage from "../page/TrendingPage";
import FavoritePage from "../page/FavoritePage";
import MyPage from "../page/MyPage";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
// import {BottomTabBar} from "react-navigation-tabs"
import {connect} from 'react-redux'
import EventBus from 'react-native-event-bus' // 功能与RN自带的Device..相似
import EventTypes from '../util/EventTypes'

const TABS = { // 配置路由页面
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '流行',
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    }
}
type Props = {};
class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true; //　禁用警告信息
    }
    _tabNavigator() {
        if (this.Tabs) {
            // state 改变了 this.Tabs 也不不重新渲染
            return this.Tabs;
        }
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage} // 根据需要定制显示tab
        // PopularPage.navigationOptions.tabBarLabel = '最新';
        return this.Tabs = createAppContainer(createBottomTabNavigator(tabs, {
            tabBarComponent: props => {
                return <TabBarComponent theme={this.props.theme} {...props}/>
            }
        }))
    }
    render() {
        // 在NavigationUtil中使用静态属性保存 BottomTabNavigator
        // NavigationUtil.navigation = this.props.navigation;
        const Tab = this._tabNavigator();
        return <Tab
            onNavigationStateChange={(prevState, newState, action) => { // 当底部Tab发生切换触发这个事件
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, { // 发送一个事件
                    from: prevState.index,
                    to: newState.index
                })
            }
            }
        />
    }
}

// 自定义 bottomNavigation.tabBar 组件
class TabBarComponent extends React.Component{
    constructor(props){
        super(props);
        console.disableYellowBox = true;
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime() // 时间作为标志位
        }
    }
    render() {
        // routes是路由数组， index是索引
        // const {routes, index} = this.props.navigation.state;
        // if (routes[index].params) {
        //     const {theme} = routes[index].params;
        //     if (theme && theme.updateTime > this.theme.updateTime) {
        //         this.theme = theme;
        //     }
        // }
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme}
            // activeTintColor={this.theme.tintColor || this.props.activeTintColor}
        />
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme, // 第一个theme 表示reducer 中的theme对象,第二个theme,是theme对象中的theme字段
    // 将state中的theme关联到props中的theme
});

export default connect(mapStateToProps)(DynamicTabNavigator);


