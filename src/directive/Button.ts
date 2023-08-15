//仓库大仓库
import { createPinia } from 'pinia'
import useUserStore from '@/stores/user'
//创建大仓库
const pinia = createPinia()
const useUser = useUserStore(pinia)
export const isHasButton = (app: any) => {
    //获取对应的用户仓库
    //全局自定义指令:实现按钮的权限
    app.directive('has', {
        //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
        mounted(el: any, options: any) {
            //自定义指令右侧的数值:如果在用户信息buttons数组当中有
            if (!useUser.buttons.includes(options.value)) {
                el.parentNode.removeChild(el)
            }
        },
    })
}
