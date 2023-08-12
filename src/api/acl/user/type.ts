// 用户管理的API的数据类型

//账号信息的ts类型
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}
//代表一个账号信息的ts类型
export interface User {
    id?: number             //新增的账号没有id，已有的账号有id
    createTime?: string     //创建数据时间
    updateTime?: string     //更新数据时间
    username?: string       //用户名字(登录的)----新增的账号没有
    password?: string       //密码----新增的账号没有
    name?: string           //用户名称(操作的)----新增的账号没有
    phone?: null
    roleName?: string       //权限身份
}
//数组包含全部的用户信息
export type Records = User[]

//获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
    data: {
        records: Records
        total: number   //全部用户数量
        size: number    //
        current: number
        pages: number
    }
}


//代表一个职位的ts类型
export interface RoleData {
    id?: number
    createTime?: string
    updateTime?: string
    roleName: string
    remark: null
}
//全部职位的列表
export type AllRole = RoleData[]
//获取全部职位的接口返回的数据ts类型
export interface AllRoleResponseData extends ResponseData {
    data: {
        assignRoles: AllRole
        allRolesList: AllRole
    }
}

//给用户分配职位接口携带参数的ts类型
export interface SetRoleData {
    roleIdList: number[]
    userId: number
}