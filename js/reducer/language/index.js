import Types from '../../action/types'
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";

const defaultState = {
    languages: [],
    keys: [],
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS: {
            console.log("action:", action)
            if (FLAG_LANGUAGE.flag_key === action.flag) {
                return {
                    ...state,
                    keys: action.languages
                }
            } else {
                return {
                    ...state,
                    languages: action.languages //languages 与默认一致
                }
            }
        }
        default:
            return state
    }
}
