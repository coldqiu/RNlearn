import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, RefreshControl, FlatList} from 'react-native';
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil'
import {connect} from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=star'
const THEME_COLOR = 'red'
type Props = {};
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['JavaScript', 'Android', 'React', 'Webpack', 'React Native'];
    }
    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}/>,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs;
    }

    render() {
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否使用标签大写，默认为true
                    scrollEnabled: true, // 是否支持 选项卡滚动，默认false
                    style: {
                        backgroundColor: '#678', // tabBar的背景颜色
                    },
                    indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
                    labelStyle: styles.labelStyle // 文字的样式
                }
            }
        ))
        return <TabNavigator/>
    }
}

class PopularTab extends Component<Props> {
    // 绑定：订阅popular的action 中的store
    constructor(props) {
        super(props);
        const {tabLabel} = this.props; // 就是最热列表页的Tab名称
        this.storeName = tabLabel;
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        const {onLoadPopularData} = this.props;
        const url = this.genFetchUrl(this.storeName)
        onLoadPopularData(this.storeName, url); // 这样调用是因为 这个页面已经
        // 使用mapDispatchToProps添加了获取数据dispatch方法，否则还可以这样获取数据：
        // const {dispatch} = this.props
        // dispatch(actions.onLoadPopularData(this.storeName, url))
    }
    genFetchUrl(KEY) {
        return URL + KEY + QUERY_STR;
    }
    renderItem(data) {
        // 在FlatList组件中作为renderItem
        const item = data.item;
        return <PopularItem
            item={item}
            onSelect={()=> {}}
        />
    }
    render() {
        const {popular} = this.props; // 这个popular是mapStateToProps传进来的
        let store = popular[this.storeName]; // 动态获取state
        if (!store) {
            store = {
               items: [],
               isLoading: false,
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.flatList}
                    data={store.items}
                    renderItem={data=>this.renderItem(data)}
                    keyExtractor={item=> "" + item.id}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            refreshing={store.isLoading} // 是否显示
                            onRefresh={() => this.loadData()}
                            tintColor={[THEME_COLOR]}
                        />
                    }
                />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    popular: state.popular
})
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
})

// 使用connect 将popularTab和store关联起来
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        color: 'red',
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    tabStyle: {
        minWidth: 50,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
    },
    flatList: {
        fontSize: 15,
        color: 'red',
    }
});

            {/*<Text onPress={() => {*/}
            {/*NavigationUtil.goPage({navigation: this.props.navigation}, "DetailPage")*/}
            {/*}}>跳转到详情页</Text>*/}
            {/*<Button*/}
            {/*title={"Fetch 使用"}*/}
            {/*onPress={() => {*/}
            {/*NavigationUtil.goPage({*/}
            {/*navigation: this.props.navigation*/}
            {/*}, "FetchDemoPage")*/}
            {/*}}*/}
            {/*/>*/}
            {/*<Button*/}
            {/*title={"DataStore 使用"}*/}
            {/*onPress={() => {*/}
            {/*NavigationUtil.goPage({*/}
            {/*navigation: this.props.navigation*/}
            {/*}, "DataStoreDemoPage")*/}
            {/*}}*/}
            {/*/>*/}
