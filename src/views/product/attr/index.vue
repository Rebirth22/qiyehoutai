<template>
  <!-- 三级分类全局组件 -->
  <Category></Category>

  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" icon="Plus" :disabled="useCategory.c3Id ? false : true">添加属性</el-button>
    <el-table border style="margin: 10px 0;">
      <el-table-column label="序号" align="center" width="80px"></el-table-column>
      <el-table-column label="属性名称" align="center" width="120px"></el-table-column>
      <el-table-column label="属性集合" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="120px"></el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
// 引入商品分类相关的仓库
import { useCategoryStore } from '@/stores/category'

const useCategory = useCategoryStore()
</script>

<style scoped></style>
