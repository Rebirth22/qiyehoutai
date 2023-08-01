// 属性管理的API接口
import request from "@/utils/request";
import type { CategoryResponseData } from "./type";
enum API{
    // 一级分类接口地址
    C1_URL = '/admin/product/getCategory1',
    //二级分类接口地址
    C2_URL = '/admin/product/getCategory2/',
    // 三级分类接口地址
    C3_URL = '/admin/product/getCategory3/'
}
// 一级分类接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
// 二级分类接口
export const reqC2 = (category1Id: number|string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
// 三级分类接口
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
