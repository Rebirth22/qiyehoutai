<!-- 实时游客数据组件 -->
<template>
    <div class="box">
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="right">可预约总量<span>99999</span>人</p>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key="index">{{ item }}</span>
        </div>
        <!-- 盒子将来echarts展示图形图标的节点 -->
        <div class="charts" ref="charts">123</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

let people = ref('215908人');// 游客人数

//安装ECharts后引用： 一个基于 JavaScript 的开源可视化图表库
import * as echarts from 'echarts';
import 'echarts-liquidfill';
//水球图拓展插件
//获取节点
let charts = ref();

onMounted(() => {
    //获取echarts类的实例
    let mycharts = echarts.init(charts.value);
    let number = ref<number>(0.6)
    let number1 = ref<number>(0.4)
    //设置实例的配置项
    mycharts.setOption({
        // //标题组件
        // title: {
        //     text: '水球图'
        // },
        //x|y轴组件
        xAxis: {},
        yAxis: {},
        //系列:决定你展示什么样的图形图标
        series: {
            type: 'liquidFill',     //系列
            data: [                 //展示的数据
                {
                    value: number.value,
                    direction: 'right',
                    itemStyle: { color: 'deepgreen' },
                    opacity: 0.9,
                },
                {
                    value: number1.value,
                    direction: 'right',
                    itemStyle: { color: 'yellowgreen' },
                    opacity: 0.5,
                }],
            waveAnimation: true,    //动画
            animationDuration: 3,
            animationDurationUpdate: 0,
            radius: '70%',          //半径
            outline: {              //外层边框颜色设置
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'yellowgreen',
                    borderColor: 'yellowgreen',
                    borderWidth: 4,
                    shadowBlur: 10,
                    shadowColor: 'yellowgreen'
                },
            },
            backgroundStyle: {
                borderWidth: 5,
                borderColor: 'red',
                color: 'yellow'
            }
        },
        //布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }

    })
})

</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;

    .top {
        margin-left: 20px;

        .title {
            color: white;
            font-size: 20px;
            margin-top: 20px;
        }

        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/dataScreen-title.png) no-repeat;
            background-size: 100% 100%;
            margin-top: 10px;
        }

        .right {
            float: right;
            color: white;
            font-size: 20px;
            margin-right: 10px;

            span {
                color: rgb(6, 38, 251);
            }
        }
    }

    .number {
        padding: 10px;
        margin-top: 30px;
        display: flex;

        span {
            flex: 1;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
        }
    }

    .charts {
        width: 100%;
        height: 250px;
    }
}
</style>