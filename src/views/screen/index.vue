<!-- 数据大屏组件 -->
<template>
  <!-- 数据大屏展示内容区域 -->
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Count class="count"></Count>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
//引入顶部的子组件
import Top from './components/Top/Top.vue'
//引入左侧的子组件
import Tourist from './components/Left/Tourist.vue'
import Sex from './components/Left/Sex.vue'
import Age from './components/Left/Age.vue'
//引入中央的子组件
import Line from './components/Center/Line.vue'
import Map from './components/Center/Map.vue'
//引入右侧的子组件
import Count from './components/Right/Count.vue'
import Rank from './components/Right/Rank.vue'
import Year from './components/Right/Year.vue'
//获取数据大屏展示内容盒子的DOM元素----必须先获取DOM
let screen = ref();
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
});
//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}
//监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 40px;

        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;

        }

        .count {
          flex: 1;
        }
      }

      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column; //垂直排布小盒子

        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;

        .map {
          flex: 4;
        }

        .line {
          flex: 1.5;
        }
      }
    }
  }
}
</style>
