// 用于注册components文件夹内部全部全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import type { App, Component } from 'vue'
// 全局组件对象
const allGloablComponents: { [name: string]: Component } = { SvgIcon } //在此处添加需要注册为全局组件的组件
// 引入elementplus注册为全局组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 对外暴露对象
export default {
  install(app: App) {
    // 注册项目的全局组件
    Object.keys(allGloablComponents).forEach((key: string) => {
      // 注册为全局组件
      app.component(key, allGloablComponents[key])
    })
    // 注册elementplus-icon为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
