import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux'
import action from '../action/index'

type Props = {};
class TrendingPage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>TrendingPage</Text>
                <Button
                    title={"改变主题颜色"}
                    onPress={() => {
                        this.props.onThemeChange('#096')
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(action.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(TrendingPage)
<<<<<<< HEAD
// console.log("connect", connect(mapStateToProps, mapDispatchToProps)(TrendingPage));
=======
>>>>>>> 04492fd4871cf07aec34d2931570acaf998eb9dc



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



