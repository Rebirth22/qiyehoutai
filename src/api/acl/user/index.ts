//用户管理模块的接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'
//枚举地址
enum API {
    ALLUSER_URL = '/admin/acl/user/',                   //获取全部已有用户账号信息
    ADDUSER_URL = '/admin/acl/user/save',               //添加一个新的用户账号
    UPDATEUSER_URL = '/admin/acl/user/update',          //更新已有的用户账号
    ALLROLEURL = '/admin/acl/user/toAssign/',           //当前用户拥有的全部职位
    SETROLE_URL = '/admin/acl/user/doAssignRole',       //给已有的用户分配角色
    DELETEUSER_URL = '/admin/acl/user/remove/',         //删除某一个账号
    DELETEALLUSER_URL = '/admin/acl/user/batchRemove',  //批量删除的接口
}
//获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number, username: string) =>
    request.get<any, UserResponseData>(
        API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
    )
//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data: User) => {
    //携带参数有ID更新
    if (data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}
//获取全部职位以及包含当前用户的已有的职位
export const reqAllRole = (userId: number) =>
    request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)
//分配职位
export const reqSetUserRole = (data: SetRoleData) =>
    request.post<any, any>(API.SETROLE_URL, data)
//删除某一个账号的信息
export const reqRemoveUser = (userId: number) =>
    request.delete<any, any>(API.DELETEUSER_URL + userId)
//批量删除的接口
export const reqSelectUser = (idList: number[]) =>
    request.delete(API.DELETEALLUSER_URL, { data: idList })
