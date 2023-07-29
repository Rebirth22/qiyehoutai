// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入登录接口
import { reqLogin, reqUserInfo } from '@/api/user'
import type { loginForm } from '@/api/user/type'
import type { UserState } from '@/stores/types/type'
// 引入操作本地存储的方法----token的处理
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoute } from '@/router/routers'

// 创建pinia小仓库
// 在 Setup Store 中：
// ref() 就是 state 属性
// computed() 就是 getters
// function() 就是 actions
const useUserStore = defineStore('User', {
  // 存储数据的地方
  state: (): UserState => {
    return {
      // token: sessionStorage.getItem('TOKEN'),//用户标识码
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组(路由)
      username: '',
      avatar: '',
    }
  },
  getters: {},
  // 异步|逻辑的地方
  actions: {
    // 用户请求登录方法
    async userLogin(data: loginForm) {
      // 登录请求
      const res: any = await reqLogin(data)
      if (res.code == 200) {
        this.token = res.data.token
        // sessionStorage.setItem('TOKEN', res.data.token)
        // 存token - --断言
        SET_TOKEN(res.data.token as string)
      } else {
        return Promise.reject(new Error(res.data.message))
      }
    },
    // 获取用户信息方法
    async userInfo() {
      const res = await reqUserInfo()
      // console.log(res);
      if (res.code == 200) {
        this.username = res.data.checkUser.username
        this.avatar = res.data.checkUser.avatar
      } else {
      }
    },
    // 用户退出登录方法
    async userLogout() {
      // 使用mock接口时无需向服务器发请求，清除用户相关数据即可
      this.token = ''
      this.username = ''
      this.avatar = ''
      sessionStorage.removeItem('TOKEN') //清楚本地token
    },
  },
})
//  对外暴露
export default useUserStore