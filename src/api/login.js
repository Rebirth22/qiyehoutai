import service from "@/utils/axios";

// 登录接口
// export function loginAPI({ username, password }) {
//     return axios.post("/admin/login", {
//         username,
//         password
//     })
// }
export const loginAPI = ({ username, password }) => {
    return service({
        url: '/admin/login',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}

// 获取用户信息接口
export const getinfoAPI = () => {
    return service({
        url: '/admin/getinfo',
        method: 'POST'
    })
}

// 退出登录接口
export const logoutAPI = () => {
    return service({
        url: '/admin/logout',
        method: 'POST'
    })
}

// 修改密码
export const repasswordAPI = ({ oldpassword, password, repassword }) => {
    return service({
        url: '/admin/updatepassword',
        method: 'POST',
        data: {
            oldpassword,
            password,
            repassword
        }
    })
}
