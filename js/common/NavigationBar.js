import React, {Component} from 'react'
import {ViewPropTypes, Text, StatusBar, View, StyleSheet, Platform, DeviceInfo} from 'react-native'
import {PropTypes} from 'prop-types'

const NAV_BAR_HEIGHT_IOS = 44;//导航栏在iOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50;//导航栏在Android中的高度
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;//状态栏的高度
const StatusBarShape = {//设置状态栏所接受的属性
    barStyle: PropTypes.oneOf(['light-content', 'default',]),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string,
};
export default class NavigationBar extends Component {
    // 提供属性的类型检查
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element,
    }

    // 设置默认属性
    static defaultProps = {
        statusBar: { // 状态栏的默认属性
            barStyle: 'light-content',
            hidden: false,
        }
    }
    render () {
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar} />
            </View> : null;

        let titleView = this.props.titleView ? this.props.title :
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>;

        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton)}
            </View>;
        return (
            <View style={styles.container}>
                {statusBar}
                {content}
            </View>
        )
    }
    getButtonElement(data) {
        return (
            <View style={styles.navBarButton}>
                {data ? data : null}
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#678'
    },
    navBarButton: {
        alignItems: 'center'
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // 判断设备类型
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // Flex布局加 absolute !?
        position: 'absolute',
        left: 40,
        right: 40,
        top: 0,
        bottom: 0
    },
    title: {
        fontSize: 20,
        color: 'white',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    }
})


