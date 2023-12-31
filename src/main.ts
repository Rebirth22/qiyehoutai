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
// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

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
// 使用组合式api写法会重置组件会报错---Store "Category" is built using the setup syntax and does not implement $reset
// 重置方法--深拷贝复制原state的状态，定义$reset方法重置state
pinia.use(({ store }) => {
    const initialState = JSON.parse(JSON.stringify(store.$state));
    store.$reset = () => {
        store.$state = JSON.parse(JSON.stringify(initialState));
    }
});

// 注册element-plus插件和注册element-plus国际化
app.use(ElementPlus, { locale: zhCn, })
// 注册自定义全局组件插件
app.use(gloablComponent)
// 注册路由
app.use(router)
// 注册pinia
app.use(pinia)

//引入自定义指令文件---全局指令，判断按钮是否有权限v-has绑定对应的按钮名字（接口返回）
import { isHasButton } from '@/directive/Button'
isHasButton(app)


// 将应用挂载到挂载点上
app.mount('#app')
