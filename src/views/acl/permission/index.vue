<!-- 菜单管理模块 -->
<template>
  <!--  row-key="id":指定了每一行数据的唯一标识 -->
  <el-table :data="PermisstionArr" row-key="id" style="width: 100%; margin-bottom: 20px" border>
    <el-table-column align="center" label="名称" prop="name"></el-table-column>
    <el-table-column align="center" label="权限值" prop="code"></el-table-column>
    <el-table-column align="center" label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column align="center" label="操作">
      <!-- row:即为已有的菜单对象|按钮的对象的数据 -->
      <template #="{ row }">
        <!-- :disabled="row.level == 4 ? true : false":处于最低层级才可以操作新的管理数据 -->
        <el-button type="primary" size="small" :disabled="row.level == 4 ? true : false" @click="addPermisstion(row)">
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button type="warning" size="small" :disabled="row.level == 1 ? true : false"
          @click="updatePermisstion(row)">编辑</el-button>
        <el-popconfirm :title="`你确定要删除${row.name}?`" @confirm="removeMenu(row.id)" width="260px">
          <template #reference>
            <el-button type="danger" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
    <!-- 表单组件:收集新增与已有的菜单的数据 -->
    <el-form>
      <el-form-item label="名称：">
        <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限：">
        <el-input placeholder="请你输入权限名字" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reqAddOrUpdateMenu, reqAllPermisstion, reqRemoveMenu } from '@/api/acl/menu';
import { MenuParams, Permisstion, PermisstionList, PermisstionResponseData } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

//组件挂载完毕
onMounted(() => {
  getHasPermisstion();
})

let PermisstionArr = ref<PermisstionList>([]);  //存储菜单的数据
// 获取菜单数据
const getHasPermisstion = async () => {
  let result: PermisstionResponseData = await reqAllPermisstion()
  if (result.code == 200) {
    PermisstionArr.value = result.data;
  }
}


let dialogVisible = ref<boolean>(false);      //控制对话框的显示与隐藏
//携带的参数
let menuData = reactive<MenuParams>({
  code: "",
  level: 0,
  name: "",
  pid: 0,
})
//添加菜单按钮的回调
const addPermisstion = (row: Permisstion) => {
  dialogVisible.value = true;                 //对话框显示出来
  //清空数据
  Object.assign(menuData, {
    code: "",
    level: 0,
    name: "",
    pid: 0,
  })
  menuData.level = row.level + 1;             //收集新增的菜单的level数值
  menuData.pid = (row.id as number);          //给谁新增子菜单
}
//编辑已有的菜单
const updatePermisstion = (row: Permisstion) => {
  dialogVisible.value = true;                 //对话框显示出来
  //点击修改按钮:收集已有的菜单的数据进行更新
  Object.assign(menuData, row);
}
//确定按钮的回调
const save = async () => {
  //发请求:新增子菜单|更新某一个已有的菜单的数据
  let result: any = await reqAddOrUpdateMenu(menuData);
  if (result.code == 200) {
    //对话框隐藏
    dialogVisible.value = false;
    //提示信息
    ElMessage({ type: 'success', message: menuData.id ? '更新成功' : '添加成功' })
    //再次获取全部最新的菜单的数据
    getHasPermisstion();
  } else {
    ElMessage({ type: 'error', message: result.data });
  }
}
//删除按钮回调
const removeMenu = async (id: number) => {
  let result = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getHasPermisstion();
  } else {
    ElMessage({ type: 'error', message: result.data });
  }
}

</script>

<style scoped></style>
