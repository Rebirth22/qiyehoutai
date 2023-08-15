// 定义小仓库的数据类型
// RouteRecordRaw是vue-router中的一个接口类型，用于描述路由配置信息。它定义了路由的路径、组件、子路由等属性。导入类型，可以在代码中声明路由相关的变量和参数，以获得更好的类型检查和代码提示。
import { CategoryObj } from '@/api/product/attr/type'
import type { RouteRecordRaw } from 'vue-router'
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

export interface CategoryState {
  c1Id: string | number
  c1Arr: CategoryObj[]
}