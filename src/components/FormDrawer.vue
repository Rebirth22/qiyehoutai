<!--侧拉表单 -->

<template>
    <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="false"
        :destroy-on-close="destroyOnClose">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-form-item>
                    <el-button type="primary" @click="submit">{{ confirmText }}</el-button>
                    <el-button type="default" @click="close">取消</el-button>
                </el-form-item>
            </div>
        </div>
    </el-drawer>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const showDrawer = ref(false)


// eslint-disable-next-line no-unused-vars
const props = defineProps({
    title: String,
    size: {
        type: String,
        default: "45%"
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "提交"
    }
})


// 打开
const open = () => showDrawer.value = true

// 关闭
const close = () => showDrawer.value = false

// 提交
const emit = defineEmits(["submit"])
const submit = () => emit("submit")


// 实现按下回车就可以提交
const onKeyUp = (e) => {
    if (e.key == "Enter")
        submit()
}
// 1.监听键盘
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})
// 2.移除键盘监听
onBeforeUnmount(() => {
    document.removeEventListener("keyup", onKeyUp)
})

// 向父组件暴露方法
defineExpose({
    open,
    close,
})
</script>
<style>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.formDrawer .actions {
    height: 50px;
    @apply mt-auto flex items-center;
}
</style>