import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {View, StyleSheet, Image, Text, TouchableOpacity, DeviceInfo} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'

export  default class BaseItem extends Component {
    static propTypes = { // 类型检查
        projectModel: PropTypes.object,
        onSelect: PropTypes.func,
        onFavorite: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite, // isFavorite状态需要最新的状态
        }
    }
    /**
     * 牢记：https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
     * componentWillReceiveProps在新版React中不能再用了
     * @param nextProps
     * @param prevState
     * @returns {*}
     */
    static getDerivesStateFromProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if (prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite
            }
        }
        return null
    }
    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite; // 这个操作的疑问解答：https://coding.imooc.com/learn/questiondetail/103141.html
        this.setState({
            isFavorite: isFavorite,
        })
    }
    onItemClick() {
        this.props.onSelect(isFavorite => {
            this.setFavoriteState(isFavorite)
        })
    }
    onPressFavorite() {
        console.log("this.state.isFavorite", this.state.isFavorite)
        this.setFavoriteState(!this.state.isFavorite); // 更新state.isFavorite状态
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
        // this.props.onFavorite 用于回调到具体的页面，将具体的item和state.isFavorite状态传递过去
    }
    _favoriteIcon() {
        // const {theme} = this.props;
        return <TouchableOpacity
            style={{padding: 6}}
            underlayColor='transparent'
            onPress={() => this.onPressFavorite()}>
            <FontAwesome
                name={this.state.isFavorite ? 'star' : 'star-o'}
                size={26}
                style={{color: 'gray'}}
            />
        </TouchableOpacity>
    }
}
