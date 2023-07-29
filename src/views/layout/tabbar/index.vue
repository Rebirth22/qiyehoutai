<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <!-- 折叠菜单图标 -->
      <el-icon style="margin-right: 10px" @click="useSetting.ifFold">
        <!-- <Fold v-if="isCollapse" />
          <Expand v-else /> -->
        <component :is="useSetting.isCollapse ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <!-- 面包动态展示路由名字与标题   v-show="item.meta.title"路由有title就展示，没有就隐藏-->
        <el-breadcrumb-item
          v-for="(item, index) in route.matched"
          :key="index"
          :to="item.path"
          v-show="item.meta.title"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span style="margin: 0 2px">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar_right">
      <el-row>
        <el-button size="small" icon="Refresh" circle @click="refresh" />
        <el-button size="small" icon="FullScreen" circle @click="fullScreen" />
        <el-button size="small" icon="Setting" circle />
        <img
          :src="useUser.avatar"
          style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
        />
      </el-row>
      <el-dropdown>
        <span style="cursor: pointer">{{ useUser.username }}</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
// layout组件相关配置仓库------折叠菜单功能和图标的切换
import { useSettingStore } from '@/stores/setting'
// 用户user相关的仓库
import useUserStore from '@/stores/user'

const route = useRoute()
const router = useRouter()
const useSetting = useSettingStore()
const useUser = useUserStore()

// 退出登录的回调函数
const logout = () => {
  //第一件事：向服务器发请求----用户退出登录接口
  // 第二件事：清除用户相关的数据-----token、username、useravatar
  useUser.userLogout()
  // 第三件事：跳转回登录页-----实现临时退出登录，重新登录返回退出登录的页面
  router.push({ path: '/login', query: { redirect: route.path } })
}

// 页面刷新功能
const refresh = () => {
  location.reload()
}

// 全屏模式的切换
const fullScreen = () => {
  const full = document.fullscreenElement
  // 切换全屏
  if (!full) {
    // 文档根节点方法 requestFullscreen 实现全屏效果
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgb(232, 223, 223),
    rgb(201, 178, 178),
    rgb(197, 165, 165)
  );

  .tabbar_left,
  .tabbar_right {
    display: flex;
    align-items: center;
    margin: 20px;
  }
}
</style>
