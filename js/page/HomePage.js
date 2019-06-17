import React, {Component} from 'react'
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import {BackHandler} from 'react-native'
import {connect} from 'react-redux'
import {NavigationActions} from 'react-navigation'
import BackPressComponent from '../common/BackPressComponent'

type Props = {};
class HomePage extends Component<Props> {
    // 设置Android 物理返回键的操作
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: this.onBackPress()});
    }
    componentDidMount() {
        // BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
        this.backPress.componentDidMount();
    }
    componentWillUnmount() {
        // BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
        this.backPress.componentWillUnmount();
    } onBackPress = () => {
        console.log("物理返回键");
        const {dispatch, nav} = this.props; // nav 来自/js/reducer/index.js
        if (nav.routes[1].index === 0) { // MainMainNavigator 不处理
            return false; // routes[0] 是InitNavigator, routes[1] 是MainNavigator
        }
        dispatch(NavigationActions.back());
        return true;
    }

    render() {
        // 在NavigationUtil中使用静态属性保存 BottomTabNavigator
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator/>
    }
}
const mapStateToProps = state => ({
    nav: state.nav
})



// const mapDispatchToProps = dispatch => ({
//     onThemeChange: theme => dispatch(action.onThemeChange(theme))
// });

// export default connect(mapStateToProps, mapDispatchToProps)(TrendingPage)
export default connect(mapStateToProps)(HomePage);


