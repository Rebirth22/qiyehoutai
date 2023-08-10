<!-- 页面顶部的分类组件 -->
<template>
    <div>
        <el-card>
            <el-form :inline="true">
                <!-- 一级分类 -->
                <el-form-item label="一级分类" placeholder="请选择">
                    <!-- v-model="c1Id"数据绑定c1Id里面的数据并显示 
                    @change="handler"触发获取下一级的菜单数据
                :disabled="!show"根据是否处于修改|添加属性的情况下禁用选择器-->
                    <el-select :disabled="show == 0 ?  true:false " v-model="useCategory.c1Id" @change="handler">
                        <el-option v-for="(c1) in useCategory.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id" />
                    </el-select>
                </el-form-item>
                <!-- 二级分类 -->
                <el-form-item label="二级分类" placeholder="请选择">
                    <el-select :disabled="show == 0 ? true : false" v-model="useCategory.c2Id" @change="handler1">
                        <el-option v-for="(c2) in useCategory.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id" />
                    </el-select>
                </el-form-item>
                <!-- 三级分类 -->
                <el-form-item label="三级分类" placeholder="请选择">
                    <el-select :disabled="show == 0 ? true : false" v-model="useCategory.c3Id">
                        <el-option v-for="(c3) in useCategory.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
// 引入商品分类相关的仓库
import useCategoryStore  from '@/stores/category'

const useCategory = useCategoryStore()
// 分类全局组件挂载完毕，通知仓库请求获取一级分类的数据
onMounted(() => {
    useCategory.getC1()
})

// 一级分类下拉菜单的change事件
const handler = () => {
    // 获取二级菜单数据前必须其清空低级菜单的数据
    useCategory.c2Id = ''
    useCategory.c3Id = ''
    useCategory.c3Arr = []
    // 通知仓库获取二级分类接口数据
    useCategory.getC2()
}
// 二级分类下拉菜单的change事件
const handler1 = () => {
    // 获取三级菜单数据前必须其清空低级菜单的数据
    useCategory.c3Id = ''
    // 通知仓库获取三级级分类接口数据
    useCategory.getC3()
}
// 接收从父组件传过来的数据---控制是否处于修改|添加属性的状态
defineProps(['show'])
</script>

<style scoped></style>