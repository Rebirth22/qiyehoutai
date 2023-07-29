import { createApp } from 'vue'
import App from './App.vue'
// 引入element-plus插件和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// svg插件配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目的全局组件对象
import gloablComponent from '@/components'
// element-plus国际化
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入模板的全局样式
import '@/styles/index.scss'
// 引入路由实例
import router from './router'
// 引入pinia
import { createPinia } from 'pinia'
//引入路由鉴权文件
import '@/permission'

// // 测试mock
// import axios from 'axios'

// axios({
//   url: '/api/user/login',//请求地址
//   method: 'post',//请求方式
//   data: {
//     username: 'admin',
//     password:'111111'
//   }
// })

// 获取应用实例对象
const app = createApp(App)
const pinia = createPinia()

// 注册element-plus插件
app.use(ElementPlus)
// // 注册element-plus国际化
// app.use(ElementPlus, { locale: zhCn })
// 注册自定义全局组件插件
app.use(gloablComponent)
// 注册路由
app.use(router)
// 注册pinia
app.use(pinia)
// 将应用挂载到挂载点上
app.mount('#app')
