<template>
  <div class="layout_container">
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside class="layout_slider" :style="{ width: useSetting.isCollapse ? '64px' : '260px' }">
        <Logo></Logo>
        <!-- 展示菜单 -->
        <!-- 滚动组件 -->
        <el-scrollbar class="scrollbar">
          <!-- 菜单组件-->
          <!-- router="true"激活绑定菜单的路由跳转 :default-active="$route.path"激活选到的路由菜单-->
          <el-menu background-color="#001529" text-color="white" :router="true" :default-active="$route.path"
            :collapse="useSetting.isCollapse ? true : false" :collapse-transition="false">
            <Meun :menuList="userStore.menuRoutes"></Meun>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <!-- 头部菜单 -->
        <el-header class="layout_tabblar" :class="{ fold: useSetting.isCollapse ? true : false }">
          <Tabbar></Tabbar>
        </el-header>
        <!-- 内容展示区域 -->
        <el-main class="layout_main" :class="{ fold: useSetting.isCollapse ? true : false }">
          <!-- 一级路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 左侧菜单的logo
import Logo from '@/layout/logo/index.vue'
// 左侧菜单的菜单组件
import Meun from '@/layout/meun/index.vue'
// 头部通栏的组件
import Tabbar from '@/layout/tabbar/index.vue'

// 获取用户相关的小仓库
import useUserStore from '@/stores/user'
const userStore = useUserStore()
// layout组件设置仓库
import { useSettingStore } from '@/stores/setting'
const useSetting = useSettingStore()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    overflow: hidden;
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    padding: 0;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    background-color: #c60cd7;

    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
