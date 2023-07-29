// 全局前置路由守卫
import router from '@/router/index'
import { notification, showLoading, hideLoading } from '@/composables/UI'




// 全局前置路由守卫
router.beforeEach(async (to, from, next) => {
    // 显示loading
    showLoading()

    // console.log("全局前置路由守卫", to, from, next)
    const token = sessionStorage.getItem("login")
    // console.log(token)
    // 如果没有登录强制跳转回登录页
    if (!token && to.path != "/login") {
        notification("请先登录", "error")
        return next({ path: "/login" })
    }
    // 防止重复登录
    if (token && to.path == "/login") {
        notification("请勿重复登录", "error")
        return next({ path: from.path ? from.path : "/" })
    }
    // 设置页面标题     显示在浏览器选项栏上面
    let title = (to.meta.title ? to.meta.title : "")
    document.title = title
    next()
})


// 全局后置守卫
router.afterEach(() => {
    hideLoading()
})