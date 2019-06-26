import React, {Component} from 'react';
import {Platform,Button, StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking} from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil'
import NavigationBar from '../../common/NavigationBar'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {MORE_MENU} from '../../common/MORE_MENU'
import GlobalStyles from '../../res/style/GlobalStyles'
import ViewUtil from "../../util/ViewUtil";
import AboutCommon,{FLAG_ABOUT} from './AboutCommon'
import config from '../../res/data/config'

type Props = {};
const THEME_COLOR = '#678'
export default class AboutPage extends Component<Props> {
    constructor(props) {
        super(props);
        console.log("this.props.in.AboutPage.js", this.props)
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about,
        }, data => this.setState({...data}));
        this.state = {
            data: config,

        }
    }
    onClick(menu) {
        const {theme} = this.props;
        let RouteName, params = {theme};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage';
                params.title = '教程';
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
                break;
            case MORE_MENU.Feedback:
                const url = 'mailto://crazycodebody@gmail.com'
                Linking.canOpenURL(url)
                    .then(support => {
                        if (!support) {
                            console.log('Can\'t handle url:' + url)
                        } else {
                            Linking.openURL(url)
                        }
                    })
                    .catch(e => {
                        console.log('An error occurred', e);
                    })

            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage'
                break
        }

        if (RouteName) {
            NavigationUtil.goPage(params, RouteName);
        }
    }
    getItem(menu) {
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
    }

    render() {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback)}
        </View>
        return this.aboutCommon.render(content, this.state.data.app)
        // this.state.data.app
        // "app": {
        //     "name": "GitHub Popular",
        //     "description": "这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。",
        //     "avatar": "http://www.devio.org/io/GitHubPopular/img/ic_app.png",
        //     "backgroundImg": "http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg"
        // }
    }
}

const styles = StyleSheet.create({

});
