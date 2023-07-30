// 品牌管理模块的接口
import request from "@/utils/request";
import type { TradeMakeResponseData } from "./type";

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


// 品牌管理相关的接口
enum API {
    TRADEMARK_URL = "/admin/product/baseTrademark"
}

export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMakeResponseData>(API.TRADEMARK_URL + `/${page}/${limit}`)