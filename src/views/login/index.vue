<template>
  <div class="login_container">
    <!-- 默认24分栏 -->
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
const loading = ref(false)
import { User, Lock } from '@element-plus/icons-vue'
// 引入用户相关的pinia仓库
import useUserStore from '@/stores/user'
// 引入路由
import { useRouter, useRoute } from 'vue-router'
// 消息提示框
import { ElNotification } from 'element-plus'
// 获取时间的函数
import { getTime } from '@/utils/getTime'

// 获取实例
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
// 给登录接口传递的参数
const loginForm = reactive({ username: 'admin', password: '111111' })
// 登录表单验证的参数
const loginForms = ref()

// 1.准备登录账号命名验证规则
// 规则（rules）、值（value）和回调函数（callback）----函数：符合条件callback放行通过，如果不符合提示错误信息
// validator函数的参数rules前面加了下划线_，这是为了避免ESLint或其他代码质量工具报错。不是必需的, 避免报错而已
const validatorUsername = (_rules: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
}
const validatorPassword = (_rules: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('密码长度至少5位'))
  }
}
const rules = {
  // required: true：表示该字段是必填字段，不能为空值。message: '用户名不能为空'：如果字段的值为空，将显示该错误消息，提示用户该字段不能为空。trigger: 'blur'：失去焦点（blur）时进行验证。change->文本发生变化
  username: [
    {
      required: true,
      max: 12,
      message: '账号长度为6位到12位',
      trigger: 'change',
    },
    { validator: validatorUsername, trigger: 'change' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { max: 12, message: '密码长度为6-12个字符', trigger: 'change' },
    { validator: validatorPassword, trigger: 'change' },
  ],
}

// 2.登录函数回调
//点击登录按钮以后干什么------>通知仓库发起请求
//请求成功->路由跳转----有query参数就跳转到query下的路径，没有就正常登录
//请求失败->弹出登陆失败信息
const login = async () => {
  // 登录前先进行登录表单验证-----校验通过再发请求
  await loginForms.value.validate()
  //按钮加载效果
  loading.value = true

  try {
    //也可以书写.then语法
    await userStore.userLogin(loginForm)
    //登录成功就跳转路由
    const redirect: any = route.query.redirect
    router.push({ path: redirect || '/' })
    //登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '登录成功！欢迎回来',
      title: `Hi! ${getTime()}好。`,
    })
    //登录成功,加载效果也消失
    loading.value = false
  } catch (error) {
    //登陆失败加载效果消失
    loading.value = false
    //登录失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 实现按下回车就可以提交账号密码实现登录
const onKeyUp = (e: any) => {
  if (e.key == 'Enter') login()
}
// 1.监听键盘
onMounted(() => {
  document.addEventListener('keyup', onKeyUp)
})
// 2.移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background2.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 70%;
    top: 30vh;
    left: 20vh;
    padding: 85px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
