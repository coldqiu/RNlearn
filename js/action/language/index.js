import LanguageDao from "../../expand/dao/LanguageDao";
import Types from "../types"
/***
 * 加载标签
 * @param flagKey
 */

export function onLoadLanguage(flagKey) {
    return async dispatch => {
        try {
            let languages = await new LanguageDao(flagKey).fetch();
            console.log("languages", languages)
            console.log("flagKey:", flagKey)
            dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey })
        }
        catch (e) {
            console.log(e)
        }
    }
}
