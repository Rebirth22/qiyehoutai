<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search">搜索</el-button>
        <el-button type="danger" size="default" @click="reset" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px;" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" width="100px" prop="id"></el-table-column>
      <el-table-column label="职位名称" align="center" width="120px" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" align="center">
        <!-- row:已有的职位对象 -->
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">分配权限</el-button>
          <el-button type="warning" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm width="260px" :title="`你确定要删除${row.roleName}?`" @confirm="removeRole(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
      @size-change="sizeChange" />
  </el-card>

  <!-- 添加职位与更新已有职位的结构:对话框 -->
  <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" ref="form" :rules="rules">
      <el-form-item label="职位名称：" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="save">确定</el-button>
      <el-button type="primary" size="default" @click="dialogVisite = false" plain>取消</el-button>
    </template>
  </el-dialog>

  <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单权限与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树型控件：默认展开以及默认选中 -->
      <!-- show-checkbox：展示复选框，节点是否可以选择 
      node-key="id"：树节点的唯一的标识
    :default-expanded-keys="[2, 3]"：默认展开节点的数组
    default-expanded-all :默认全部展开
     :default-checked-keys="[5]"：默认勾选的节点的数组-->
      <div>
        <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
          :default-checked-keys="selectArr" :props="defaultProps" />
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <!-- @click="confirmClick"@click="cancelClick" -->
        <el-button type="primary" @click="handler">确定</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reqAddOrUpdateRole, reqAllMenuList, reqAllRoleList, reqRemoveRole, reqSetPermisstion } from '@/api/acl/role';
import { MenuList, MenuResponseData, Records, RoleData, RoleResponseData } from '@/api/acl/role/type';
import useSettingStore from '@/stores/setting';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';

let pageNo = ref<number>(1)         //当前页码
let pageSize = ref<number>(10)      //一页展示几条数据
let keyword = ref<string>('')       //搜索职位关键字
let total = ref<number>(0)          //职位总个数
let allRole = ref<Records>([])      //存储全部已有的职位
//获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager;
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value);
  if (result.code == 200) {
    total.value = result.data.total;
    allRole.value = result.data.records;
  }
}
//组件挂载完毕----获取职位请求
onMounted(() => {
  getHasRole()
})
//下拉菜单的回调
const sizeChange = () => {
  getHasRole()
}
//搜索按钮的回调
const search = () => {
  //再次发请求根据关键字
  getHasRole();
  keyword.value = '';
}
//重置按钮的回调
const useSetting = useSettingStore()
const reset = () => {
  useSetting.refresh = !useSetting.refresh
}


let dialogVisite = ref<boolean>(false)        //控制对话框的显示与隐藏
let form = ref<any>()                         //获取form组件实例
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
  roleName: ''
})
//自定义校验规则的回调
const validatorRoleName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack();
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [
    { required: true, trigger: 'blur', validator: validatorRoleName }
  ]
}

//确定按钮的回调
const save = async () => {
  //表单校验结果,结果通过在发请求、结果没有通过不应该在发生请求
  await form.value.validate();
  //添加职位|更新职位的请求
  let result: any = await reqAddOrUpdateRole(RoleParams);
  if (result.code == 200) {
    //提示文字
    ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' });
    //对话框显示
    dialogVisite.value = false;
    //再次获取全部的已有的职位
    getHasRole(RoleParams.id ? pageNo.value : 1);
  }
}
//确定按钮的回调----添加||编辑职位的确认
const addRole = () => {
  dialogVisite.value = true        //对话框显示出来
  //清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0
  });
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName');
  })
}
//更新已有的职位按钮的回调
const updateRole = (row: RoleData) => {
  dialogVisite.value = true       //显示出对话框
  Object.assign(RoleParams, row)  //存储已有的职位----带有ID的
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName');
  })
}
//删除已有的职位
const removeRole = async (id: number) => {
  let result: any = await reqRemoveRole(id)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// 分配权限的功能
let drawer = ref<boolean>(false)      //控制抽屉组件的显示
let menuArr = ref<MenuList>([])       //定义数组存储用户权限的数据
let selectArr = ref<number[]>([])     //数组用于存储勾选的节点的ID(四级的，具体的权限)
// 点击分配权限的按钮回调函数
const setPermisstion = async (row: RoleData) => {
    drawer.value = true;              //抽屉显示出来
  Object.assign(RoleParams, row)      //收集当前要分类权限的职位的数据
  //根据职位获取权限的数据
  let result: MenuResponseData = await reqAllMenuList((RoleParams.id as number));
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }

}

// 筛选已经选中的权限---- 具体的权限
const filterSelectArr = (allData: any, initArr: any) => {
  // console.log(allData);
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id);
    }
    // 递归搜索下层孩子是否存在
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  })
  return initArr
}
// 树型控件的方法
const defaultProps = {
  children: 'children',
  label: 'name',
}


let tree = ref<any>()                              //获取tree组件实例
//抽屉确定按钮的回调----每个树型节点的复选框都有对应的id(不重复)
const handler = async () => {
  const roleId = (RoleParams.id as number)         //职位的ID
  //选中节点的ID----getCheckedKeys()返回当前选中节点 key 的数组
  let arr = tree.value.getCheckedKeys()
  //半选的ID----getHalfCheckedKeys()返回目前半选中的节点的key所组成的数组(选中的节点上层节点id)           
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)             //合并节点的id数组
  // 下发权限
  let result: any = await reqSetPermisstion(roleId, permissionId)
  if (result.code == 200) {
    drawer.value = false                           //抽屉关闭
    ElMessage({ type: 'success', message: '分配权限成功' })
    //页面刷新
    window.location.reload()
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
