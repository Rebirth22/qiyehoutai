<template>
      <div>
          <el-col :sm="12" :lg="6" class="m-auto my-50">
              <el-result icon="warning" title="404提示" sub-title="你的页面走丢了">
                  <template #extra>
                      <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
                  </template>
              </el-result>
          </el-col>
      </div>

</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
.box {
    width: 100vw;
    height: 100vh;
    background: yellowgreen;
    display: flex;
    justify-content: center;

    img {
        width: 800px;
        height: 400px;
    }

    button {
        width: 50px;
        height: 50px;
    }
}
</style>