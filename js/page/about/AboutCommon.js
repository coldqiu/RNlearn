import React from 'react';
import BackPressComponent from "../../common/BackPressComponent";
import NavigationUtil from "../../navigator/NavigationUtil";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {View, Text, Image, Dimensions, DeviceInfo, StyleSheet, Platform} from 'react-native'
import config from '../../res/data/config';
import GlobalStyles from "../../res/style/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";

export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};
const THEME_COLOR = '#678'
const window = Dimensions.get('window');
const AVATAR_SIZE = 90; // 头像大小
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + TOP : GlobalStyles.nav_bar_height_android; // 顶部title的高度
export default class AboutCommon {
    constructor(props, updataState) {
        this.props = props;
        this.updataState = updataState; // 是一个函数，用于更新state
        this.backPress = new BackPressComponent({backPress: () => this.backPress()})
        // this.updataState({
        //     config
        // })
    }
    onBackPress() {
        this.onBack()
        return true;
    }
    onBack() {
        NavigationUtil.goBack(this.props.navigation)
    }
    componentDidMount() {
        this.backPress.componentDidMount()
        // 关于页面的数据来源：
        // http://www.devio.org/io/GitHubPopular/json/github_app_config.json
        fetch('')
            .then(response => {
                if (response.ok) {
                    return response.json
                }
                throw new Error('Network Error')
            })
            .then(config => {
                if (config) {
                    this.updataState({
                        data: config
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    onShare() {
        // let shareApp;
        // const {flagAbout} = this.props;
        // if (flagAbout === FLAG_ABOUT.flag_about_me) {
        //     shareApp = share.share_app;
        // } else {
        //     shareApp = share.share_blog;
        // }
        //
        // ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, shareApp.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
        //     console.log("result:" + code + message);
        // });

        //第三方登录
        // ShareUtil.auth(0,e=>{
        //     console.log("result:" + e);
        // })
    }
    getParallaxRenderConfig(params) {
        // 用于生成组件<ParallaxScrollView>配置参数
        let config = {}
        let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar
        config.renderBackground = () => (
            <View key="background">
                <Image source={{uri: 'http://pic.xiami.net/images/artist/12300184613340.jpg',
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT}}/>
                <View style={{position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT}}/>
            </View>
        )
        config.renderForeground=() => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar } source={avatar}/>
                <Text style={ styles.sectionSpeakerText }>
                    {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                    {params.description}
                </Text>
            </View>
        )
        config.renderStickyHeader=() => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>Rich Hickey Talks</Text>
            </View>
        )
        config.renderFixedHeader=() => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
                {ViewUtil.getShareButton(() => this.onShare())}
            </View>
        )
        return config
    }
    // containerView 这个参数哪里来的 /调用时传递进来了
    render(containerView, params) {
        const renderConfig = this.getParallaxRenderConfig(params)
        return (
            <ParallaxScrollView
                backgroundColor={THEME_COLOR}
                contentBackgroundColor={GlobalStyles.backgroundColor}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                backgroundScrollSpeed={10}
                {...renderConfig}>
                {containerView}
            </ParallaxScrollView>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        alignItems: 'center',
        paddingTop: TOP,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10,
    },
    fixedSection: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        paddingRight: 8,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: TOP,
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5,
        marginBottom: 10, //
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 16,
        marginRight: 10,
        marginLeft: 10,
    },
});
