// 品牌管理模块的接口
import request from "@/utils/request";
import type { TradeMark, TradeMakeResponseData } from "./type";



// 品牌管理相关的接口
enum API {
    // 获取已有品牌的接口
    TRADEMARK_URL = "/admin/product/baseTrademark",
    // 添加品牌
    ADDTRADEMARK_URL = "/admin/product/baseTrademark/save",
    // 修改已有品牌
    UPDATETRADEMARK_URL = "/admin/product/baseTrademark/update",
    //删除已有品牌
    DELETE_URL = '/admin/product/baseTrademark/remove/',
}
// 获取已有品牌
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMakeResponseData>(API.TRADEMARK_URL + `/${page}/${limit}`)
// 添加品牌   和  修改品牌的接口
export const reqAddorUpdateTrademark = (data: TradeMark) => {
    // 修改品牌
    if (data.id) {
        return request.put<any, any>(API.UPDATETRADEMARK_URL,data)
    } else {
        // 添加品牌
        return request.post<any, any>(API.ADDTRADEMARK_URL, data)
    }
}
// 删除品牌
//删除某一个已有品牌的数据
export const reqDeleteTrademark = (id: number) =>request.delete<any, any>(API.DELETE_URL + id)





// export const reqHasTrademark = (page: number, limit: number) => {
//     return request({
//         url: "/admin/product/baseTrademark"+`/${page}/${limit}`,
//         method: 'GET',
//         params: {
//             page,
//             limit
//         }
//     })
// }
