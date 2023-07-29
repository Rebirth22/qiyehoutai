// 封装token有关操作的接口
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, getinfoAPI } from '../api/login'

export const doLogin = defineStore('login', () => {
    // 1.定义管理用户数据的state
    const logintoken = ref({})
    // 2.定义获取接口的数据的函数----获取token并赋值给对象logintoken
    const getToken = async (username, password) => {
        const res = await loginAPI({ username, password })
        // 获取登陆时的token
        logintoken.value = res.token
        // console.log(logintoken.value)
    }

    // 清除localStorage里面的token
    // 退出时清除token
    const clearToken = () => {
        sessionStorage.removeItem('login')
    }

    // 获取用户信息action
    const userInfo = ref({})
    const getUserinfo = async () => {
        const res = await getinfoAPI()
        // console.log(res)
        userInfo.value = res
    }
    return {
        logintoken,
        userInfo,
        getToken,
        clearToken,
        getUserinfo,
    }

}, {
    persist: {
        //token持久化插件注册，将token保存在sessionStorage
        //推荐保存在此处，关闭页面会自动清除，localStorage不会清除
        storage: sessionStorage,
    }
})