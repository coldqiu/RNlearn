import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import DataStore from '../expand/dao/DataStore'

type Props = {};
export default class DataStoreDemoPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            showText: ''
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}> 离线缓存页面 </Text>
                <View style={styles.input_container}>
                    <TextInput style={styles.input}
                               onChangeText={text => {

                               }}
                    />
                    <Button
                        title='获取'
                        onPress={() => {
                            this.loadData();
                        }}
                    />
                </View>
            </View>
        );
    }
}

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
