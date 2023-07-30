<template>
  <el-card class="box-card">
    <!-- 品牌管理添加品牌的按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
    <!-- table表格组件展示已经添加的品牌 -->
    <!-- :data="trademarkArr"相对于表格绑定trademarkArr数据 -->
    <el-table style="margin: 10px 0;" border :data="trademarkArr">
      <!-- border--纵向的分割线   width--表格宽度   align--表格文字对齐方式-->
      <el-table-column label="序号" width="120px" align="center" type="index"></el-table-column>
      <!-- 默认展示数据是div -->
      <el-table-column label="品牌名称" width="150px" align="center" prop="tmName"></el-table-column>
      <el-table-column label="品牌名称" width="150px" align="center">
        <!-- 	自定义列的内容 作用域参数为 { row, column, $index } -->
        <template #="{ row }">
          <pre style="color: rgb(255, 0, 0);">{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌Logo" align="center" width="250px" height="250px">
        <!-- 图片展示要用插槽 -->
        <template #="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 125px;height: 125px;">
        </template>
      </el-table-column>
      <el-table-column label="品牌操作" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="warning" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <!-- Pagination的属性
      v-model:current-page---
      v-model:page-size---每页显示条目个数
      :page-sizes---每页显示个数选择器的选项设置
      :background---	是否为分页按钮添加背景色
      layout="total, sizes, prev, pager, next, jumper"----组件布局，子组件名用逗号分隔,   "->"表示把后面的部分顶到右边
     -->
    <el-pagination v-model:current-page="pageNow" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
      layout=" prev, pager, next, jumper,->,sizes,total " :total="400" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
// 引入品牌管理的接口
import { reqHasTrademark } from '@/api/product/trademark';
// 定义接口发送和接收数据的数据类型
import type { Records, TradeMakeResponseData } from '@/api/product/trademark/type';

// 当前页码
const pageNow = ref<number>(1)
// 每页展示的数据条数
const limit = ref<number>(3)
// 存储已有品牌数据总数
const total = ref<number>()
// 存储已有品牌的数据
const trademarkArr = ref<Records>([])
//获取已有品牌的接口封装成一个函数-----实现可重复调用获取数据
const getHasTrademark = async () => {
  const res: TradeMakeResponseData = await reqHasTrademark(pageNow.value, limit.value)
  if (res.code == 200) {
    // 品牌总数
    total.value = res.data.total
    // 品牌数据
    trademarkArr.value = res.data.records
  }
}
onMounted(() => {
  getHasTrademark()
})
</script>

<style scoped></style>
@/api/product/trademark@/api/product/trademark/type