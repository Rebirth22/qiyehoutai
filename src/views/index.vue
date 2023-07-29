<template>
    <el-button text @click="exitLogin">退出登录</el-button>
</template>
<script setup>
import { useRouter } from 'vue-router';
// 导入UI提示组件
import { notification, comfirmbox } from '@/composables/UI'
// 导入已经封装好的登录接口组件
import { doLogin } from '@/stores/doLogin'
// 导入退出登录接口
import { logoutAPI } from '@/api/login'
const dologin = doLogin()
const router = useRouter()
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