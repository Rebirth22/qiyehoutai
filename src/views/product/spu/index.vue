<!-- SPU管理 -->
<template>
  <div>
    <Category :show="show == 0"></Category>
    <el-card style="margin: 10px 0;">
      <div v-show="show == 0">
        <el-button type="primary" icon="plus" :disabled="useCategory.c3Id ? false : true"
          @click="addSpu">添加SPU</el-button>
        <!-- :data="records"展示有的spu数组数据 -->
        <el-table style="margin: 10px 0;" border :data="records">
          <el-table-column label="序号" align="center" width="120px" type="index"></el-table-column>
          <el-table-column label="SPU名称" align="center" width="120px" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" align="center" prop="description"></el-table-column>
          <el-table-column label="SPU操作" align="center">

            <template #="{ row }">
              <el-button title="添加SKU" size="small" icon="plus" type="primary" @click="addSku"></el-button>
              <el-button title="修改SPU" size="small" icon="edit" type="warning" @click="updateSpu(row)"></el-button>
              <el-button title="查看SPU" size="small" icon="search" type="info"></el-button>
              <el-popconfirm :title="`你确定删除${row.attrName}?`" width="200px">
                <template #reference>
                  <el-button title="删除SPU" size="small" icon="delete" type="danger"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNow" @current-change="getHasSpu" v-model:page-size="pageSize"
          @size-change="changeSize" :page-sizes="[5, 7, 10]" :background="true"
          layout=" prev, pager, next, jumper,->,sizes,total " :total="total" />
      </div>

      <!-- 添加一个新的SPU和修改SPU的的表单结构 -->
      <!-- ref="spuEdit" 获取子组件实例-->
      <SpuForm ref="spudata" v-show="show == 1" @changeShow="changeShow"></SpuForm>
      <!-- 添加一个SKU表单结构 -->
      <SkuForm v-show="show == 2" @changeShow="changeShow"></SkuForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
// 引入分类的仓库
import { useCategoryStore } from '@/stores/category';
// 引入Spu
import { reqHasSpu } from '@/api/product/spu';
//引入接口参数类型
import type { HasSpuResponseData, Records, SpuData } from '@/api/product/spu/type';
// 引入子组件---添加一个SPU和修改SPU的的表单结构 和  添加一个SKU表单结构 
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'


const useCategory = useCategoryStore()
// 控制分类组件的禁用
const show = ref<number>(2) //0:展示数据    1：添加一个新的SPU和修改SPU   2：添加一个SKU
// 分页器默认的页码
const pageNow = ref<number>(1)
// 分页器默认展示的数据条数
const pageSize = ref<number>(5)
// 存储获取到的已有的SPU数组
const records = ref<Records>([])
// 存储获取到的SPU总个数
const total = ref<number>(0)
// 获取子组件实例
const spudata = ref<any>()



// 监听三级分类的数据变化
watch(() => useCategory.c3Id, () => {
  // 有三级分类的Id才发请求
  if (!useCategory.c3Id) return
  getHasSpu()
})

// 子组件SpuForm绑定自定义事件：让子组件通知父组件切换场景为show==0的场景---子组件点击取消按钮
const changeShow = (obj: any) => {
  show.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNow.value);
  } else {
    //添加留在第一页
    getHasSpu();
  }
}
// 分页器展示页面数据发送变化时触发
const changeSize = () => {
  getHasSpu()
}
// 获取某个三级分类下的SPU数据
const getHasSpu = async (pager = 1) => {
  pageNow.value = pager
  const res: HasSpuResponseData = await reqHasSpu(pageNow.value, pageSize.value, useCategory.c3Id)
  // console.log(res);
  if (res.code == 200) {
    records.value = res.data.records
    total.value = res.data.total
    // console.log(records.value);
  }
}
// 点击添加SPU按钮添加SPU
const addSpu = () => {
  //切换显示的表单
  show.value = 1
  //点击添加SPU按钮,调用子组件的方法初始化数据
  spudata.value.initAddSpu(useCategory.c3Id);
}
// 点击添加SKU按钮添加SKU
const addSku = () => {
  //切换显示的表单
  show.value = 2

}

// 点击修改按钮的回调
const updateSpu = (row: SpuData) => {
  // 切换状态
  show.value = 1
  // console.log(spudata.value);
  spudata.value.initHasSpuData(row)
}




</script>

<style scoped></style>
