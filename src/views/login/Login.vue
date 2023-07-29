<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 导入路由，以便登录成功可以跳转
import { useRouter } from 'vue-router';
// 导入消息警示框
import { notification } from '@/composables/UI'
// 登录操作的相关数据和操作
import { doLogin } from '@/stores/doLogin'



// 需要绑定到表单 <el-form-item prop="username"> <el-form-item prop="password">
const form = ref({
    username: "admin",
    password: "admi",
    agree: false,
})

// 2.准备登录账号命名验证规则
const rules = {
    // required: true：表示该字段是必填字段，不能为空值。message: '用户名不能为空'：如果字段的值为空，将显示该错误消息，提示用户该字段不能为空。trigger: 'blur'：表示验证触发的时机是在失去焦点（blur）时进行验证。
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 3, max: 12, message: '密码长度为6-12个字符', trigger: 'blur' },
    ],
    agree: [{
        // 这段代码是一个验证器函数，用于验证用户是否同意了某个协议。该验证器函数为一个对象数组，其中包含一个键为'validator'的验证器。当调用该验证器函数时，它会接收三个参数：规则（rules）、值（value）和回调函数（callback）。
        // validator函数的参数rules前面加了下划线_，这是为了避免ESLint或其他代码质量工具报错。不是必需的,避免报错而已
        validator: (_rules, value, callback) => {
            // console.log(value)
            // 自定义校验逻辑
            // 勾选就通过 不勾选就不通过
            if (value) {
                callback()
            } else {
                callback(new Error('请勾选协议'))
            }
        }
    }]

}

// 3.对登录做统一校验
// 绑定表单<el-form ref="formRef" :model="form" class="form" :rules="rules" >
const formRef = ref(null)
const router = useRouter()

const doLogining = doLogin()

const onSubmit = () => {
    const { username, password } = form.value
    // 调用formRef.value.validate()来验证表单的有效性。如果表单验证不通过（即valid为false），则函数会返回false并终止执行。
    // validate 是一个方法，用于验证表单的有效性。它接收一个回调函数，形参名为 valid
    formRef.value.validate(async (valid) => {
        if (!valid) {
            return false
        }
        await doLogining.clearToken()
        await doLogining.getToken(username, password)
        await doLogining.getUserinfo()
        //  ElNotification消息提示框的UI组件
        notification("登录成功", 'success')

        router.push("/")
    })

}
// 实现按下回车就可以提交账号密码实现登录
const onKeyUp = (e) => {
    if (e.key == "Enter")
        onSubmit()
}
// 1.监听键盘
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})
// 2.移除键盘监听
onBeforeUnmount(() => {
    document.removeEventListener("keyup", onKeyUp)
})


</script> 
<template>
    <!--100vh表示相对于视口高度的100%。视口高度是指浏览器可见区域的高度    min-h-screen相当于style="min-height: 100vh;"-->
    <!-- <el-row style="min-height: 100vh;" class="bg-purple-500"> -->
    <el-row class="login-container">
        <!-- 默认24分栏 -->
        <el-col :lg="16" :md="12" class="left ">
            <div>
                <div>VUE3+Vite+ElementPlus+WIndi CSS实战开发</div>
                <div>Start Learn</div>
            </div>
        </el-col>

        <el-col :lg="8" :md="12" class="right">
            <h2>欢迎回来</h2>

            <!-- h-[1px]指定元素的高度设置为 1 像素      space-x-2沿x轴方向元素间距 -->
            <div class="title">
                <span class="line"></span>
                <span>账号密码登录</span>
                <span class="line"></span>
            </div>

            <el-form ref="formRef" :rules="rules" :model="form" class="form">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" clearable>
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password>
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="agree" label-width="22px">
                    <el-checkbox size="large" v-model="form.agree">
                        我已同意隐私条款和服务条款
                    </el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button round color="#8b5cf6" class="w-[250px]" type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>


<style>
.login-container {
    @apply min-h-screen bg-purple-500;
}

.login-container .left,
.login-container .right {
    @apply flex items-center justify-center flex-col;
}

.left>div {
    @apply text-4xl font-bold;

}

.left>div>div:first-child {
    @apply text-light-50 mb-8
}

.left>div>div:last-child {
    @apply text-gray-200 text-3xl text-center underline
}

.right {
    @apply bg-light-50;
}

.right>h2 {
    @apply font-bold text-3xl text-gray-800 mb-6
}

.title {
    @apply flex items-center justify-center text-gray-300 mb-5 space-x-2;
}

.line {
    @apply h-[1px] w-16 bg-gray-300
}

.form {
    @apply w-[250px]
}
</style>