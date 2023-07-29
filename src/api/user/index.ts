//统一管理用户相关的接口
import request from '@/utils/request'

// 引入登录接口需要携带的ts类型
import type { loginForm, loginResponseData, userReponseData } from './type'

//统一管理接口
// enum定义和使用特定的常量集合
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
}
// 暴露登录函数
// 1.登录接口方法
export const reqLogin = (data: loginForm) =>
  // post<any, loginResponseData>定义了登录接口返回的数据类型
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 2.获取用户信息
export const reqUserInfo = () =>
  // get<any, userReponseData>获取返回的用户信息类型
  request.get<any, userReponseData>(API.USERINFO_URL)
