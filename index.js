/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {createAppContainer} from 'react-navigation'
// import AppNavigator from './js/navigator/AppNavigator'
import {name as appName} from './app.json';
import App from './js/App'

AppRegistry.registerComponent(appName, () => App);
