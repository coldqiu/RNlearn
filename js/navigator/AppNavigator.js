import {
    createStackNavigator,
    createMaterialTopTabNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
} from "react-navigation"
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'

const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            header: null, // 禁用 StackNavigator的 Navigation Bar
        }
    }
})

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null, // 禁用 StackNavigator的 Navigation Bar
        }
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            header: null, // 禁用 StackNavigator的 Navigation Bar
        }
    }
})

export default createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,
}, {
    defaultNavigationOptions: {
        header: null, // 禁用 StackNavigator的 Navigation Bar
    }
})
