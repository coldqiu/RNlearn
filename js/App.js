/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Provider} from 'react-redux'
import store from './store/index'
import AppNavigator from './navigator/AppNavigators'
import {createAppContainer} from 'react-navigation'

const TestWrap = createAppContainer(AppNavigator)
type Props = {};
export default class App extends Component<Props> {
    render() {
        return <Provider store={store}>
            <TestWrap/>
        </Provider>
    }
}

