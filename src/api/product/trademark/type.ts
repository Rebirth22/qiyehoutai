export interface ResponseData {
    code: number
    message: string
    ok: boolean
}
// 已有品牌的数据类型
export interface TradeMark {
    id?: number//新增的可能还没有id
    tmName: string
    logoUrl: string
}
// 包含全部品牌数据的ts类型
export type Records = TradeMark[]
// 获取的已有全部品牌的数据ts类型
export interface TradeMakeResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}
// {
// "code": 200,
// "message": "成功",
// "data":
// {
// "records": [{
//            "id": 1,
//            "createTime": "2021-12-10 01:31:41",
//            "updateTime": "2023-04-15 15:48:02",
//            "tmName": "小米",
//            "logoUrl": "39.98.123.211/group1/M00/03/D9/rBC6AQ-j2AAAb72A3EO0942.jpg"
//               }],
//   "total": 26,
//   "size": 3,
//   "current": 1,
//   "orders": [],
//   "optimizeCountSql": true,
//   "hitCount": false,
//   "countId": null,
//   "maxLimit": null,
//   "searchCount": true,
//   "pages": 9
// },
//     "ok": true
// }