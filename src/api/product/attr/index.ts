// 属性管理的API接口
import request from "@/utils/request";
import type { AttrResponseData, CategoryResponseData } from "./type";
enum API {
    // 一级分类接口地址
    C1_URL = '/admin/product/getCategory1',
    //二级分类接口地址
    C2_URL = '/admin/product/getCategory2/',
    // 三级分类接口地址
    C3_URL = '/admin/product/getCategory3/',
    // 获取分类下的商品基础属性和属性值
    ATTR_URL = '/admin/product/attrInfoList/',
    // 添加或者修改已有属性的接口
    ADDorUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    //删除某一个已有的属性
    DELETEATTR_URL = '/admin/product/deleteAttr/',
}
// 一级分类接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
// 二级分类接口
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
// 三级分类接口
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
// 对应分类下的商品基础属性和属性值
export const reqAttr = (
    category1Id: number | string,
    category2Id: number | string,
    category3Id: number | string
) =>
    request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
//新增或者修改属性
export const reqAddOrUpdateAttr = (data: Attr) => request.post(API.ADDorUPDATEATTR_URL, data)
//删除某一个已有的属性业务
export const reqRemoveAttr = (attrId: number) =>
    request.delete<any, any>(API.DELETEATTR_URL + attrId)

// 修改属性携带的参数
// {   "id":""//已有属性的ID
//     "attrName": "string",//已有属性的名字
//     "attrValueList": [
//              {
//                 "attrId": "",//属性值归属于哪个属性
//                 "id": ',//已有属性值的ID
//                 "valueName": "string"
//             }
//         ],
//             "categoryId": 0,//已有的属归属于哪个三级分类
//             "categoryLevel": 3,//代表的几级分类
// }

// 添加属性携带的参数
// {
//     "attrName": "string",//新增属性的名字
//     "attrValueList": [//新增属性值数组
//             {
//                 "valueName": "string"
//             }
//         ],
//             "categoryId": 0,//三级分类的ID
//             "categoryLevel": 3,//代表的几级分类
// }