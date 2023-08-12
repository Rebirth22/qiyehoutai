<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="danger" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 展示用户数据 -->
  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <!-- :disabled="selectIdArr.length ? false : true": 有被选中的对象才可以点击批量删除-->
    <el-button type="danger" size="default" :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser">批量删除</el-button>
    <!-- table展示用户信息 -->
    <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data="userArr">
      <!-- type="selection"复选框 
      @selection-change="selectChange"：table复选框勾选的时候会触发的事件-->
      <!-- show-overflow-tooltip文字溢出用提示框来显示 -->
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index" :index="(pageNow - 1) * pageSize + 1"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="warning" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- @current-change 当页码改变时会触发 getHasUser 
        @size-change="changeSize"当每页显示条目数改变时会触发 changeSize
        -->
    <el-pagination v-model:current-page="pageNow" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasUser"
      @size-change="changeSize" />

  </el-card>
  <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <!-- :model="userParams":表单的数据将双向绑定到userParams的属性上
        ref="formRef"可通过formRef实现对表单组件的操作和访问。 
      -->
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <!--v-model="userParams.username"： 收集新增用户的信息 -->
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <!-- v-if="!userParams.id"有id就处于更新状态，不用展示密码 -->
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <!-- @click="save"保存新增用户信息并重新获取全部用户 -->
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <!-- v-model="checkAll"：当checkAll的值发生变化时，复选框的状态也会相应更新，反之亦然。
              :indeterminate="isIndeterminate"：isIndeterminate变量设置复选框的半选状态（即既未完全勾选也未完全取消勾选的状态）。当isIndeterminate为true时，复选框会显示为半选中的状态 -->
          <el-checkbox @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
          <!-- 显示职位的的复选框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="confirmClick">确定</el-button>
        <el-button @click="drawer1 = false">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reqAddOrUpdateUser, reqAllRole, reqRemoveUser, reqSelectUser, reqSetUserRole, reqUserInfo } from '@/api/acl/user/index';
import type { AllRole, AllRoleResponseData, Records, SetRoleData, User, UserResponseData } from '@/api/acl/user/type'
import useSettingStore from '@/stores/setting';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';

//组件挂载完毕--先获取用户全部数据
onMounted(() => {
  getHasUser()
})
// 分页器的数据和用户数据
let pageNow = ref<number>(1)      //默认页码
let pageSize = ref<number>(5)     //一页展示几条数据
let total = ref<number>(0)        //用户总个数
let userArr = ref<Records>([])    //存储全部用户的数组
//获取全部已有的用户信息---搜索指定用户时会根据keyword获取数据(不查找时可不携带)
// 接口地址：'/admin/acl/user/${page}/${limit}/?username=${username}'
const getHasUser = async (page = 1) => {
  pageNow.value = page          //收集当前页码
  let result: UserResponseData = await reqUserInfo(pageNow.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

//分页器下拉菜单的自定义事件的回调
const changeSize = () => {
  getHasUser()
}



let drawer = ref<boolean>(false)        //定义响应式数据控制抽屉的显示与隐藏
//收集用户信息的响应式数据----用于添加用户的操作
let userParams = reactive<User>({ username: '', name: '', password: '' })
//添加用户按钮的回调
const addUser = () => {
  drawer.value = true//抽屉显示出来
  //先清空数据
  Object.assign(userParams, { id: 0, username: '', name: '', password: '' })
}


let formRef = ref<any>()                //获取form组件实例
//校验新增用户名字回调函数
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//校验用户昵称回调函数
const validatorname = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
//校验新增用户密码回调函数
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
    callBack();
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验的规则对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

//保存添加用户信息按钮的回调-------测试注意：后台接口会校验用户信息符不符合校验
const save = async () => {
  //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
  //保存按钮:添加新的用户|更新已有的用户账号信息
  let result: any = await reqAddOrUpdateUser(userParams)
  //添加或者更新成功
  if (result.code == 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' });
    //获取最新的全部账号的信息----有用户id更新留在当前页，新增回到第一页
    //会出现操作修改超级管理员账号的时候丢失用户，要重置浏览器
    getHasUser(userParams.id ? pageNow.value : 1)
    // window.location.reload()      //浏览器自动刷新一次
  } else {
    //关闭抽屉
    drawer.value = false;
    //提示消息
    ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' });
  }
}
//取消按钮的回调
const cancel = () => {
  //关闭抽屉
  drawer.value = false;
}

//更新已有的用户按钮的回调
const updateUser = (row: User) => {
  //抽屉显示出来
  drawer.value = true;
  //存储收集已有的账号信息
  Object.assign(userParams, row)
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

let drawer1 = ref<boolean>(false)       //控制分配用户职位交互框的显示与隐藏
let allRole = ref<AllRole>([])          //存储全部职位的数据
let userRole = ref<AllRole>([])         //当前用户已有的职位
// 点击编辑按钮触发----分配用户职位信息
const setRole = async (row: User) => {
  //存储已有的用户信息到userParams，在表单中调用
  Object.assign(userParams, row)
  //获取全部的职位的数据与当前用户已有的职位的数据
  let result: AllRoleResponseData = await reqAllRole((userParams.id as number));
  if (result.code == 200) {
    allRole.value = result.data.allRolesList  //存储全部的职位
    userRole.value = result.data.assignRoles  //存储当前用户已有的职位
    drawer1.value = true                      //抽屉显示出来
  }
}

let checkAll = ref<boolean>(false)            //收集职位复选框全选数据
const isIndeterminate = ref<boolean>(true)    //控制顶部全选复选框不确定的样式(-号)
//点击全选复选框行为----全选或者不全选职位
const handleCheckAllChange = (val: boolean) => {
  //val:true(全选)|false(没有全选)
  userRole.value = val ? allRole.value : [];
  //不确定的样式(确定样式)
  isIndeterminate.value = false
}
//逐个点击职位来现全选的功能
const handleCheckedCitiesChange = (value: string[]) => {
  //顶部复选框的勾选数据
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  //不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}

//确定分配职位按钮的回调----抽屉组件中
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: (userParams.id as number),        //用户的id
    roleIdList: userRole.value.map(item => { return (item.id as number) })//分配到的职位对应的id集合
  }
  //分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' });
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNow.value)
  }
}



let selectIdArr = ref<User[]>([])   //准备一个数组存储批量删除的用户的ID
//删除某一个用户----根据用户id删除 
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getHasUser(userArr.value.length > 1 ? pageNow.value : pageNow.value - 1);
  }
}
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value       //存储全选到的用户全部数据
  // console.log(value)

}
//批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map(item => {
    return item.id
  });
  //批量删除的请求
  let result: any = await reqSelectUser(idsList);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNow.value : pageNow.value - 1)
    //根据当前页存储全部用户的数组长度判断
  }
}
//搜索功能----定义响应式数据:收集用户输入进来的关键字
let keyword = ref<string>('')
//搜索按钮的回调
const search = () => {
  //根据关键字获取相应的用户数据
  getHasUser()
  //清空关键字
  keyword.value = ''
}

// 重置页面的回调函数
const usesetting= useSettingStore()
const reset = () => {
  usesetting.refresh = !usesetting.refresh;
}
</script>

<style scoped></style>
