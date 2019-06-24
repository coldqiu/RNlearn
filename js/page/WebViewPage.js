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
export default class WebViewPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        console.log("this.WebViewPage.props", this.props)
        // 如何将projectModel进来
        // console.log("this.params-DetailPage.js", this.params)
       const {title, url} = this.params
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
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

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack, // navState 哪来的？
            url: navState.url
        })
    }
    render() {
        let navigationBar = <NavigationBar
            title={this.state.title}
            style={{backgroundColor: THEME_COLOR}}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress() )}
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
