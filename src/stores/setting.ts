// 创建layout相关的小仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('useSettingStore', () => {
  // 折叠菜单的相关回调
  const isCollapse = ref(true)
  const ifFold = () => {
    isCollapse.value = !isCollapse.value
  }
  return {
    isCollapse,
    ifFold,
  }
})
