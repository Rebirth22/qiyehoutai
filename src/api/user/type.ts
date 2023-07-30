
// 定义接收数据类型
// 关键字 interface 被用来声明接口，并用 loginForm 作为接口的名称

// 1.登录接口需要携带的ts类型
export interface loginFormData {
  username: string
  password: string
}

//2.登录接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok:boolean
}
export interface loginResponseData extends ResponseData {//继承 ResponseData的数据类型，符合接口返回数据
  data: string
}


// 3.获取用户相关的数据类型
export interface userInfoReponseData extends ResponseData {
  data: {
    avatar: string
    buttons: string[]
    name: string
    roles: string[]
    routes:string[]
    
  }
}






// ------mock接口的数据类型定义------mock接口的数据类型定义-------
// // 定义接收数据类型
// // 关键字 interface 被用来声明接口，并用 loginForm 作为接口的名称

// // 1.登录接口需要携带的ts类型
// export interface loginForm {
//   username: string
//   password: string
// }

// //2.登录接口返回的数据类型
// // token存储在一个对象中需要先定义
// interface dataType {
//   token?: string
//   message?: string
// }
// export interface loginResponseData {
//   code: number
//   data: dataType
// }

// // 3.定义服务器返回用户相关的数据类型
// // mock接口返回的数据类型
// interface userInfo {
//   userId: number
//   avatar: string
//   username: string
//   password: string
//   desc: string
//   roles: []
//   buttons: []
//   routes: []
//   token: string
// }
// // checkUser包装成对象
// interface user {
//   checkUser: userInfo
// }
// export interface userReponseData {
//   code: number
//   data: user
// }
