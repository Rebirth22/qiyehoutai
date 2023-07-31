<template>
  <el-card class="box-card">
    <!-- 品牌管理添加品牌的按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
    <!-- table表格组件展示已经添加的品牌 -->
    <!-- :data="trademarkArr"相对于表格绑定trademarkArr数据 -->
    <el-table style="margin: 10px 0;" border :data="trademarkArr">
      <!-- border--纵向的分割线   width--表格宽度   align--表格文字对齐方式-->
      <el-table-column label="序号" width="120px" align="center" type="index"></el-table-column>
      <!-- 排序品牌后 -->
      <el-table-column label="序号" width="120px" align="center">
        <template #default="{ $index }">
          {{ (pageNow - 1) * limit + $index + 1 }}
        </template>
      </el-table-column>
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
        <template #="{ row }">
          <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
          <el-popconfirm :title="`确认删除${row.tmName}?`" icon="Delete" @confirm="removeTrademark(row.id)">
            <template #reference>
              <el-button type="warning" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <!-- Pagination的属性:
      v-model:current-page---
      v-model:page-size---每页显示条目个数
      :page-sizes---每页显示个数选择器的选项设置
      :background---	是否为分页按钮添加背景色
      layout="total, sizes, prev, pager, next, jumper"----组件布局，子组件名用逗号分隔,   "->"表示把后面的部分顶到右边
      Pagination的事件:
      current-change----current-page 改变时触发--------@current-change="getHasTrademark()"直接绑定获取数据的函数也可以
      size-change	-------page-size 改变时触发
     -->
    <el-pagination @size-change="sizeChange" @current-change="getHasTrademark()" v-model:current-page="pageNow"
      v-model:page-size="limit" :page-sizes="[3, 5, 7, 9, 20]" :background="true"
      layout=" prev, pager, next, jumper,->,sizes,total " :total="total" />
  </el-card>
  <!-- 点击添加品牌按键触发的对话框 -->
  <!-- v-model:控制对话框的显示和隐藏---布尔值
   -->
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
    <!-- :model="trademarkParams" 将表单元素的值与VtrademarkParams属性保持同步 -->
    <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称 :" label-width="100px" prop="tmName">
        <!--  v-model="trademarkParams.tmName"收集添加的品牌数据名字 -->
        <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName" />
      </el-form-item>
      <el-form-item label="品牌Logo :" label-width="100px" prop="logoUrl">
        <!-- 添加品牌的上传图片的组件 
        action:请求 URL,即图片需要上传到的服务器地址,需书写/api，否则代理服务器不发送这次post请求
      :show-file-list="false"：是否显示图片的名字在交互框
      :before-upload="beforeAvatarUpload"：限制用户上传文件的格式和大小
      :on-success="handleAvatarSuccess" ：文件上传成功触发的勾子
      -->
        <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
// 引入品牌管理的接口
import { reqHasTrademark, reqAddorUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
// 定义接口发送和接收数据的数据类型
import type { Records, TradeMakeResponseData, TradeMark } from '@/api/product/trademark/type';
// 上传图片的格式类型
import { ElMessage, type UploadProps } from 'element-plus'


// 当前页码
const pageNow = ref<number>(1)
// 每页展示的数据条数
const limit = ref<number>(3)
// 存储已有品牌数据总数
const total = ref<number>()
// 存储已有品牌的数据
const trademarkArr = ref<Records>([])
// 控制弹窗对话框的显示和隐藏的数据
const dialogFormVisible = ref<boolean>(false)
// 定义收集新增品牌的数据
const trademarkParams = reactive<TradeMark>({ tmName: '', logoUrl: '', })
// 获取el-form组件实例
const formRef = ref()

//获取已有品牌的接口封装成一个函数-----实现可重复调用获取数据
const getHasTrademark = async (page = 1) => {
  //当前页码---默认显示第一页
  pageNow.value = page;
  const res: TradeMakeResponseData = await reqHasTrademark(pageNow.value, limit.value)
  if (res.code == 200) {
    // 品牌总数
    total.value = res.data.total
    // 品牌数据
    trademarkArr.value = res.data.records
  }
}
//组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})

// 改变每次显示页面的数据条数时,自动显示第一页
const sizeChange = () => {
  pageNow.value = 1
}


// 自定义的表单校验规则
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候,会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack();
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack();
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}
// 提交添加品牌表单校验
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}

// 添加品牌按钮的回调函数
const addTrademark = () => {
  dialogFormVisible.value = true
  // 交互框数据清空
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''

  // 清除掉上一次操作产生的校验结果
  // 第一种写法
  // formRef.value?.clearValidate('logoUrl')
  // formRef.value?.clearValidate('tmName')
  // 第二种写法---nextTick函数是在Vue.js框架中常用的一个异步方法。它被用来将回调函数延迟到下一个DOM更新周期之后执行，以确保该回调函数在DOM更新完成后执行
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 品牌图片上传之前触发的勾子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
    ElMessage.error('图片格式必须是JPEG文件、PNG文件或GIF文件!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大小不能超过4MB!')
    return false
  }
  return true
}
// 品牌图片上传成功触发的勾子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // response：此次上传品牌图片post请求服务器返回的数据
  // console.log(response)
  trademarkParams.logoUrl = response.data
}

// 修改已有品牌按钮的回调函数
const updateTrademark = async (row: TradeMark) => {// 修改已有品牌需要携带id发送到服务器

  // 清除掉上一次操作产生的校验错误结果
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  // console.log(row);  
  dialogFormVisible.value = true
  // 用es6的语法合并对象---赋值
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl


}

// 删除已有品牌按钮的回调函数
const removeTrademark = async (id: number) => {
  // 点击确认就删除选定品牌
  const res = await reqDeleteTrademark(id)
  if (res.code == 200) {
    ElMessage({ type: 'success', message: "删除成功" })
  } else {
    ElMessage({ type: 'error', message: "删除失败" })
  }
  // 删除后获取最新的品牌数据
   getHasTrademark(trademarkArr.value.length > 1 ? pageNow.value : pageNow.value - 1);
}

// 确认上传品牌图片按钮
const confirm = async () => {
  // 确认上传前必须对表单校验
  // 只有校验成功才放行，校验失败不执行后面的代码
  await formRef.value.validate();
  const res: any = await reqAddorUpdateTrademark(trademarkParams)
  // 添加||修改已有品牌
  if (res.code == 200) {
    // 关闭交互框
    dialogFormVisible.value = false
    // 提示添加成功
    ElMessage({ type: 'success', message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功' })
    // 添加成功重新获取已有品牌的数据
    getHasTrademark(trademarkParams.id ? pageNow.value : 1);
  } else {
    // 提示添加失败
    ElMessage({ type: 'error', message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败' })
    // 关闭交互框
    dialogFormVisible.value = false
  }
}

// 取消上传品牌图片按钮
const cancel = () => {
  dialogFormVisible.value = false
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>