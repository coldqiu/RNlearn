import Types from '../../action/types'


const defaultState = {
    theme: 'blue'
}
export default function onAction(state=defaultState, action) {
    // console.log("reducer/theme/index.js-state", state);
    switch (action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme
            };
        default:
            return state
    }
}
