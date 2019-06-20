import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, DeviceInfo} from 'react-native';
import WebView from 'react-native-webview'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from '../common/BackPressComponent'
import FavoriteDao from '../expand/dao/FavoriteDao'


const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

type Props = {};
export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        // 如何将projectModel进来
        // console.log("this.params-DetailPage.js", this.params)
        const {projectModel, flag} = this.params;
        this.favoriteDao = new FavoriteDao(flag)
        // 最热模块与趋势模块的url不同
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName
        const title = projectModel.item.full_name || projectModel.item.fullName
        // console.log("title", title)
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
            isFavorite: projectModel.isFavorite,
        }
        //   this.backPress = new BackPressComponent({backPress: this.onBackPress()}) // 直接执行了函数
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()}) // 函数绑定
    }
    componentDidMount() {
        // BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
        this.backPress.componentDidMount();
    }
    componentWillUnmount() {
        // BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
        this.backPress.componentWillUnmount();
    }
    onBackPress() {
        this.onBack();
        return true;
    }
    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    onFavoriteButtonClick() {
        const {projectModel, callback} = this.params
        const isFavorite = projectModel.isFavorite = !projectModel.isFavorite
        callback(isFavorite) // 将收藏状态传递出去，给列表页
        this.setState({
            isFavorite: isFavorite
        })
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString()
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
        } else {
            this.favoriteDao.removeFavoriteItem(key)
        }
    }
    renderRightButton() {
        return (
            <View
                style={{flexDirection: 'row'}}
            >
                <TouchableOpacity
                    onPress={() => this.onFavoriteButtonClick()}
                >
                    <FontAwesome
                        name={this.state.isFavorite ? 'star' : 'star-o'}
                        size={20}
                        style={{color: 'white', marginRight: 10}}
                    />
                </TouchableOpacity>
                {ViewUtil.getShareButton(() => {})}
            </View>
        )
    }
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack, // navState 哪来的？
            url: navState.url
        })
    }
    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            title={this.state.title}
            style={{backgroundColor: THEME_COLOR}}
            titleLayoutStyle={titleLayoutStyle}
            rightButton={this.renderRightButton()}
        />
        return (
            <View
                style={styles.container}
            >
                {navigationBar}
                <WebView
                    ref={webView=>this.webView=webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e=>this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                />
                {/*<Text style={{color: 'red', fontSize: 18}}>{this.state.url}</Text>*/}
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
    },

});
