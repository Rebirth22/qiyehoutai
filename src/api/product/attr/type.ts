// 分类相关接口的数据类型
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}
export interface CategoryObj {
    id: number | string
    name: string
    category1Id?: number
    category2Id?: number
}

// 相应的分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

// 分类下的商品属性和属性值的数据类型
// 一个属性值的数据类型
export interface AttrValue {
    id?: number
    valueName: string
    attrId?: number
}
// 存储每一个属性值的数据类型
export type AttrValueList = AttrValue[]
// 属性对象
export interface Attr {
    id?: number
    attrName: string
    categoryId: number|string
    categoryLevel: number
    attrValueList: AttrValueList
}
// 存储每一个属性对象的数组类型
export type AttrList = Attr[]

// 属性接口返回的数据类型
export interface AttrResponeData extends ResponseData{
    data:Attr[]
}



   
