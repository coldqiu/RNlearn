// 全局导航跳转工具类

export default class NavigationUtil {
    /**
     * 跳转到指定页面
     * @params params 参数
     * @params page  跳转到这个页面
     */
    static goPage(params, page) {
        // const {navigation} = params;
        const navigation = NavigationUtil.navigation
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
            return;
        }
        navigation.navigate(
            page,
            {
                ...params
            }
        )
    }

    /**
     * 返回上一页
     * @params navigatiom
     */
    static goBack(navigation) {
        navigation.goBack()
    }

    /**
     * 重置到首页
     * @param navigation
     */
    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate("Main");
    }
}
