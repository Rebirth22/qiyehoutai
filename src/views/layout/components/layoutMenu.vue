<template>
    <div>{{ dologin.userInfo  }}</div>
</template>
<script setup>
// 导入已经封装好的登录接口组件
import { doLogin } from '@/stores/doLogin'

const dologin = doLogin()


</script>