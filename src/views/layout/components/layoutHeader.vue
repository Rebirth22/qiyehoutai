<template>
    <div class="header">
        <span class="logo">
            <el-icon class="mr-1">
                <ChatSquare />
            </el-icon>
            VUE3+Vite+ElementPlus+WIndi
        </span>
        <!-- 文字提示 -->
        <el-tooltip effect="dark" content="Bottom Center prompts info" placement="bottom">
            <el-icon class="icon-btn">
                <Fold />
            </el-icon>
        </el-tooltip>
        <!-- 刷新页面 -->
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="refresh">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center mr-20">
            <el-icon class="icon-btn" @click="toggle">
                <FullScreen v-if="!isFullscreen" />
                <Aim v-else />
            </el-icon>
            <el-dropdown @command="userCommand">
                <span class="el-dropdown-link">
                    <el-avatar class="mr-2" :size="40" :src="dologin.userInfo.avatar" />
                    Admin
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="exitLogin">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>



    <FormDrawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="100px">
                <el-form-item prop="oldpassword" label="旧密码">
                    <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="新密码 :">
                    <el-input v-model="form.password" placeholder="请输入新密码" type="password" show-password>
                        <template #prefix>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword" label="确认密码 :">
                    <el-input v-model="form.repassword" placeholder="请输入确认密码" type="password" show-password>
                        <template #prefix>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
    </FormDrawer>
</template>
<script setup>
import { ref, reactive } from 'vue'
// 导入已经封装好的登录接口组件
import { doLogin } from '@/stores/doLogin'
import { useRouter } from 'vue-router';
// 导入UI提示组件
import { notification, comfirmbox } from '@/composables/UI'
// 导入接口
import { logoutAPI, repasswordAPI } from '@/api/login'
// 页面全屏
import { useFullscreen } from '@vueuse/core'
// 引入侧拉菜单组件
import FormDrawer from '@/components/formDrawer.vue';


const dologin = doLogin()
const router = useRouter()

// 刷新
const refresh = () => {
    location.reload()
}

// 切换全屏状态 isFullscreen(是否全屏状态) toggle(切换全屏)
const { isFullscreen, toggle } = useFullscreen()

// 修改密码的框，默认不显示
const formDrawerRef = ref(false)

// 用户头像处，修改密码和退出登录逻辑
// <el-dropdown @command="userCommand">下拉菜单绑定事件
const userCommand = (click) => {
    switch (click) {
        case "exitLogin":
            exitLogin()
            break;
        case "changePassword":
            formDrawerRef.value.open()
            break;

    }
}
// 修改密码的逻辑
const form = reactive({
    oldpassword: "",
    password: "",
    repassword: ""
})
// 2.准备修改密码验证规则
const rules = {
    oldpassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { min: 3, max: 12, message: '密码长度为6-12个字符', trigger: 'blur' }
    ],
    repassword: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { min: 3, max: 12, message: '密码长度为6-12个字符', trigger: 'blur' }
    ]
}

const formRef = ref(null)
const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (!valid) {
            return false
        }
        await repasswordAPI(form)
            .then(() => {
                notification("修改成功", 'success')
                doLogin.clearToken()
                router.push("/")
            })
    })
}
// 退出登录逻辑
const exitLogin = async () => {
    await comfirmbox("是否确认退出")
        .then(() => {
            //链接退出登录的接口
            logoutAPI()
                .finally(() => {
                    dologin.clearToken()
                    // 提示退出登录成功
                    //跳转回登录页
                    router.push("/login")
                    notification("退出登录成功")
                })
        })
}


</script>

<style>
.header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0 h-65px
}

.logo {
    @apply flex justify-center items-center text-xl font-thin ml-50 cursor-pointer;
}

.icon-btn {
    @apply flex justify-center items-center cursor-pointer m-3;
    width: 40px;
    height: 65px;
}

.icon-btn:hover {
    @apply bg-indigo-500
}

.el-dropdown-link {
    @apply flex justify-center items-center text-light-50 ml-5 cursor-pointer
}
</style>