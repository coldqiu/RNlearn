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
        this.dataStore = new DataStore();
    }
    loadData() {
        let url =  `https://api.github.com/search/repositories?q=${this.searchKey}`
        this.dataStore.fetchData(url)
            .then(data => {
                let showData = `初次数据加载的时间： ${new Date(data.timestamp)}\n
                ${JSON.stringify(data.data)}`
                this.setState({
                    showText: showData
                })
            })
            .catch((error) => {
                error && console.log(error.toString());
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}> 离线缓存页面 </Text>
                <View style={styles.input_container}>
                    <TextInput style={styles.input}
                               onChangeText={text => {
                                   this.searchKey = text;
                               }}
                    />
                    <Button
                        title='获取'
                        onPress={() => {
                            this.loadData();
                        }}
                    />
                </View>
                <Text>
                    {this.state.showText}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
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
    input: {
        height: 60,
        borderColor: 'red',
        borderWidth: 1,
        marginRight: 10,
    }
});
