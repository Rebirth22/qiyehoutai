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
        <el-table-column label="操作" align="center" width="150px">
          <template #="{ row }">
            <el-button type="warning" size="small" icon="edit" @click="updateAttr(row)"></el-button>
            <el-popconfirm :title="`你确定删除 ${row.attrName}? `" width="200px" @confirm="deleteAttr(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-show="show == false">
      <!-- 展示添加属性和修改属性的结构 -->
      <el-form :inline="true">
        <el-form-item label="属性名称 :">
          <!-- v-model="attrParams"绑定收集新增属性值的数据 -->
          <el-input placeholder="请输入属性名称" width="120px" v-model="attrParams.attrName"></el-input>
        </el-form-item>
      </el-form>
      <!-- :disabled="attrParams.attrName?false:true"有新增的属性名字才启用按钮 -->
      <el-button type="primary" size="default" icon="Plus" :disabled="attrParams.attrName ? false : true"
        @click="addAttrValue">添加属性</el-button>
      <el-button type="warning" size="default" plain @click="cancel">取消</el-button>
      <el-table border style="margin: 15px 0;" :data="attrParams.attrValueList">
        <el-table-column label="序号" type="index" align="center" width="120px"></el-table-column>
        <el-table-column label="属性值名称" align="center" width="300px">
          <template #="{ row, $index }">
            <!-- v-model="row.valueName"收集属性值的数据并传给valueName保存 
            通过@blur="toLook"或@click="toEdit"来控制row.flag的布尔值实现切换编辑或者查看的状态
            :ref="(vc: any) => inputArr[$index] = vc"绑定新增属性值的表单，通过索引index聚焦input框
            -->
            <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
              v-model="row.valueName" placeholder="请输入属性值名称"></el-input>
            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="属性值操作" align="center">
          <template #="{ $index }">
            <!--  @click="attrParams.attrValueList.splice($index, 1)"根据表单元素的索引删除数据 -->
            <el-button type="danger" size="small" icon="delete"
              @click="attrParams.attrValueList.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="default" @click="save"
        :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
      <el-button type="warning" size="default" plain @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>
+
<script setup lang="ts">
// 引入监听函数
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
// 引入商品分类相关的仓库
import { useCategoryStore } from '@/stores/category'
// 分类的接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
// 商品分类的数据类型
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';

// 实例化接口
const useCategory = useCategoryStore()
// 存储商品的属性和属性值
const attrArr = ref<Attr[]>([])
// 点击添加属性按钮切换显示组件的绑定数据变化
const show = ref<boolean>(true)
// 收集新增属性的数据
const attrParams = reactive<Attr>({
  attrName: "",//新增属性的名字
  attrValueList: [],//新增属性值数组
  categoryId: '',//三级分类的ID
  categoryLevel: 3,//代表的三级分类
})
//准备一个数组:将来存储对应的组件实例el-input
const inputArr = ref<any>([]);


//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  useCategory.$reset();
})
// 监听三级分类Id的变化
watch(() => useCategory.c3Id, () => {
  // 获取数据前先清空上一次查询的数据
  attrArr.value = []
  // 保证存在三级分类才发请求
  if (!useCategory.c3Id) return
  // 获取分类的Id
  getAttr()
})

// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = useCategory
  const res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
    // console.log(attrArr.value);
  }
}

// 点击添加属性按钮切换卡片
const addAttr = () => {
  // 每次点击就清空数据再收集
  Object.assign(attrParams, {
    attrName: "",//新增属性的名字
    attrValueList: [],//新增属性值数组
    categoryId: useCategory.c3Id,// 点击按钮时收集三级分类的Id，并保存做发送新增属性的请求的参数
    categoryLevel: 3,//代表的三级分类
  })
  show.value = !show.value
}

// 点击修改属性按钮切换卡片
const updateAttr = (row: Attr) => {
  show.value = !show.value
  //将已有的属性对象赋值给attrParams对象即为
  //ES6->Object.assign进行对象的合并----将row的对象的属性复制到attrParams的对象中--首先，JSON.stringify(row)将row对象转换为字符串表示形式。-----然后，JSON.parse(...)将这个字符串表示形式转换回一个新的对象。
  // Object.assign(attrParams,(row))--+浅拷贝，数据会同步变化，影响原来的数据
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));//深拷贝
}

// 点击取消按钮结束操作返回分类的数据页面
const cancel = () => {
  show.value = true
}

// 添加属性值的方法
const addAttrValue = () => {
  // 点击添加属性值按钮的时候，向数组提娜佳一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true//控制每一个新增的属性的属性值表单的编辑模式和查看模式的标识符   
  })
  //获取最后el-input组件最后的元素的聚焦状态
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  })
}

// 点击保存按钮触发
const save = async () => {
  //发请求
  const result: any = await reqAddOrUpdateAttr(attrParams as any)
  //添加属性|修改已有的属性已经成功
  if (result.code == 200) {
    //切换场景
    show.value = !show.value
    //提示信息
    ElMessage({ type: 'success', message: attrParams.id ? '修改成功' : '添加成功' });
    //获取全部已有的属性与属性值
    await getAttr();
  } else {
    ElMessage({ type: 'error', message: attrParams.id ? '修改失败' : '添加失败' })
  }
}


//属性值表单元素失却焦点事件回调
const toLook = (row: AttrValue, $index: number) => {

  //非法情况判断1----trim()删除字符串前后的空格，若为空则函数报错
  if (row.valueName.trim() == '') {
    //删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1);
    //提示信息
    ElMessage({ type: 'error', message: '属性值不能为空' })
    return;
  }
  //非法情况2----属性值不能相同
  const repeat = attrParams.attrValueList.find((item) => {
    //切记把当前失却焦点属性值对象从当前数组扣除判断
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {//属性值重复就执行删除
    //将重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1);
    //提示信息
    ElMessage({ type: 'error', message: '属性值不能重复' })
    return;
  }
  //相应的属性值对象flag:变为false,展示div
  row.flag = false;
}

//属性值div点击事件切换编辑状态事件回调
const toEdit = (row: AttrValue, $index: number) => {
  //相应的属性值对象flag:变为true,展示input
  row.flag = true;
  //nextTick:响应式数据发生变化,获取更新的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus();
  })
}

// 删除某个已有属性值方法函数回调
const deleteAttr = async (attrId: number) => {
  // 发送请求
  const res: any = await reqRemoveAttr(attrId)
  //删除成功
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //获取一次已有的属性与属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<style scoped></style>
