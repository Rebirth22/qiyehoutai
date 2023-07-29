// 通过vue-router插件实现路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
// 路由设置的页面分配组件
import { constantRoute } from './routers'

// 创建路由实例
const router = createRouter({
  // 路由模式hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为     表示每次路由导航后，页面会滚动到最顶部的位置。
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
export default router
