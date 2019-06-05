import React, {Component} from 'react';
import {NavigationActions} from "react-navigation"
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import {connect} from 'react-redux'


type Props = {};
class HomePage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state.nav = ''
    }
    componentDidMount() {

    }

    componentWillUnmount() {
    }
    onBackPress = () => {
        const {dispatch, nav} = this.props;
        if (nav.routes[1].index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    }
    render() {
        // 在NavigationUtil中使用静态属性保存 BottomTabNavigator
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator />
    }
}
const mapStateToProps = state => ({
    nav: state.nav
})

export default connect()
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
