// 路由鉴权-----判断路由能不能访问页面
import router from './router'
import { ElNotification } from 'element-plus'
// 引入进度条的插件
//@ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css' //样式文件
nprogress.configure({ showSpinner: false }) // 去掉进度条的加载小圆圈

import useUserStore from './stores/user'

// 全局守卫：项目中任意路由切换都会触发的勾子
// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = `${to.meta.title}` //设置页面在浏览器顶部的标题
  // 访问某个一个路由之前的守卫
  // to:你要访问的路由   from：你从哪个路由来   next：路由放行函数

  const useUser = useUserStore() //获取存储token的仓库
  const token = useUser.token //获取token
  const username = useUser.username //获取用户信息
  nprogress.start() //启用进度条
  if (token) {
    // 用户已登录的状态
    if (to.path == '/login') {
      // 登录成功后无法访问登录页，自动跳转到首页
      next({ path: '/' })
    } else {
      // 登录成功放行除登录'/login'以外的其他路由
      if (username) {
        //有用户信息就放行
        next()
      } else {
        // 没有用户信息就发送请求获取用户信息
        try {
          //获取用户信息
          await useUser.userInfo()
          //放行
          //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({ ...to })
        } catch (error) {
          //token过期:获取不到用户信息了-----用户手动修改本地存储token
          //退出登录->用户相关的数据清空
          await useUser.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录的状态
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } }) //query:{redirect:to.path}指向你在网页输入框输入想访问的路由
      //未登录状态的提示信息
      ElNotification({ type: 'error', message: '请先登录' })
    }
  }
  next()
})

// 全局后置守卫
router.afterEach(() => {
  nprogress.done()
})

// 第一个问题：任意路由切换实现进度条业务----nprogress
// 第二个问题：路由鉴权(路由组件访问权限的设置)
// 全部路由组件：登录 || 404 || 任意路由 || 首页 || 权限管理(3个子路由) || 商品管理(4个子路由)

//用户未登录：可以访问login，其余的路由无法访问并跳转回login登录页面
// 用户已登录：不可以访问login[指向首页]，其余路由可以访问
