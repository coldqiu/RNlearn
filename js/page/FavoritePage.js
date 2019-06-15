import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import action from '../action/index'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavigationBar from '../common/NavigationBar'

const THEME_COLOR = '#678'
type Props = {};
class FavoritePage extends Component<Props> {
    getRightButton () {
        return <View>
            <TouchableOpacity
                onPress={() => {
                }}
            >
                <View style={{padding: 5, marginRight:8}}>
                    <Feather
                        name={'search'}
                        size={24}
                        style={{color: 'white'}}
                    />

                </View>

            </TouchableOpacity>
        </View>
    }
    getLeftButton (callBack) {
        return <TouchableOpacity style={{padding: 8, paddingLeft: 12}}
                                 onPress={callBack}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />
        </TouchableOpacity>
    }
    renderTitleView(callBack) {
        return  <TouchableOpacity style={{padding: 8, paddingLeft: 12}}
                                  onPress={callBack}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />
            <Text style={{fontSize: 18, color: 'red'}}>sssssssssss</Text>
        </TouchableOpacity>
    }
    render() {
        let statusBar = {
            backGroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView(()=>console.log("收藏"))}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={this.getRightButton()}
            leftButton={this.getLeftButton()}
        />;
        return (
            <View style={styles.container}>
                {navigationBar}
                {this.renderTitleView(()=>console.log("收藏"))}
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



