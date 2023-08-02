<template>
  <!-- 三级分类全局组件 -->
  <Category :show="show"></Category>

  <el-card style="margin: 10px 0;">
    <div v-show="show == true">
      <el-button @click="addAttr" type="primary" size="default" icon="Plus"
        :disabled="useCategory.c3Id ? false : true">添加属性</el-button>
      <el-table border style="margin: 10px 0;" :data="attrArr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
        <el-table-column label="属性集合" align="center">
          <template #="{ row }">
            <el-tag style="margin:5px;" v-for="(item) in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template #="{ row, $index }">
            <el-button type="warning" size="small" icon="edit" @click="updateAttr"></el-button>
            <el-button type="danger" size="small" icon="delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-show="show == false">
      <!-- 展示添加属性和修改属性的结构 -->
      <el-form :inline="true">
        <el-form-item label="属性名称 :">
          <el-input placeholder="请输入属性名称" width="120px" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="default" icon="Plus">添加属性</el-button>
      <el-button type="warning" size="default" plain @click="cancel">取消</el-button>
      <el-table border style="margin: 15px 0;">
        <el-table-column label="序号" type="index" align="center" width="120px"></el-table-column>
        <el-table-column label="属性值" align="center" width="120px"></el-table-column>
        <el-table-column label="属性值操作" align="center"></el-table-column>
      </el-table>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="warning" size="default" plain @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// 引入监听函数
import { reactive, ref, watch } from 'vue';
// 引入商品分类相关的仓库
import { useCategoryStore } from '@/stores/category'
// 分类的接口
import { reqAttr } from '@/api/product/attr';
// 商品分类的数据类型
import { AttrResponeData, Attr } from '@/api/product/attr/type';

const useCategory = useCategoryStore()
// 存储商品的属性和属性值
const attrArr = ref<Attr[]>([])
// 点击添加属性按钮切换显示组件的绑定数据变化
const show = ref<boolean>(true)
// 收集新增属性的数据
const attrParams = reactive<Attr>({
  attrName: "",//新增属性的名字
  attrValueList: [//新增属性值数组
    // {
    //   "valueName": "string"
    // }
  ],
  categoryId: "",//三级分类的ID
  categoryLevel: 3,//代表的三级分类
})

// 监听三级分类Id的变化
watch(() => useCategory.c3Id, async () => {
  // 获取数据前先清空上一次查询的数据
  attrArr.value = []
  // 保证存在三级分类才发请求
  if (!useCategory.c3Id) return
  // 获取分类的Id
  const { c1Id, c2Id, c3Id } = useCategory
  const res: AttrResponeData = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
    console.log(attrArr.value);
  }
})

// 点击添加属性按钮切换卡片
const addAttr = () => {
  show.value = !show.value
}
// 点击修改属性按钮切换卡片
const updateAttr = () => {
  show.value = !show.value
}

// 点击取消按钮结束操作返回分类的数据页面
const cancel = () => {
  show.value = !show.value
}
</script>

<style scoped></style>
