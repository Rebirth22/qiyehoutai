// 进行axios的二次封装：使用请求拦截器和响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入token的方法
import useUserStore from '@/stores/user'
//第一步：创建axios实例----其他配置：基础路径超时时间
const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //VITE_APP_BASE_API = '/api'---基础路径
  timeout: 5000, //超时的时间设置
})
//第二步：axios实例添加请求拦截器和响应拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么----config配置对象，headers属性请求头(给服务器携带token)
    // 返回配置对象
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.token = userStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)
//axios响应式拦截器
request.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    //处理网络错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default request
