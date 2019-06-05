import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux'
import action from '../action/index'

type Props = {};
class FavoritePage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>FavoritePage</Text>
                <Button
                    title={"改变主题颜色"}
                    onPress={() => {
                        this.props.onThemeChange('#206')
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

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage)


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


// import React, {Component} from 'react';
// import {StyleSheet, Text, View, Button} from 'react-native';
// import {connect} from 'react-redux'
// import action from '../action/index'
//
// type Props = {};
// class FavoritePage extends Component<Props> {
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.welcome}>FavoritePage</Text>
//                 <Button
//                     title={"改变主题颜色"}
//                     onPress={() => {
//                         this.props.onThemeChange('#206')
//                     }}
//                 />
//             </View>
//         );
//     }
// }
//
// const mapStateToProps = state => ({});
//
// const mapDispatchToProps = dispatch => ({
//     onThemeChange: theme => dispatch(action.onThemeChange(theme))
// });
//
// export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage)
//
//
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
//     welcome: {
//         fontSize: 20,
//         textAlign: 'center',
//         margin: 10,
//     },
//     instructions: {
//         textAlign: 'center',
//         color: '#333333',
//         marginBottom: 5,
//     },
// });



