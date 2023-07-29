
import { createApp } from 'vue'
import App from './App.vue'
// 引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入windi.css
import 'virtual:windi.css'
// 引入路由实例并挂载挂载
import router from './router'
//全局引入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入pinia和pinia状态持续化插件
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 导入全局守卫设置
import "@/router/guards"
// 引入全局loading样式进度台
import "nprogress/nprogress.css"

const app = createApp(App)
const pinia = createPinia()

// 挂载ElementPlus
app.use(ElementPlus)

//挂载整个应用支持路由
app.use(router)
// 挂载图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}



app.use(pinia)
pinia.use(piniaPluginPersistedstate)

app.mount('#app')
