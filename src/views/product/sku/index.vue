<template>
  <el-card>
    <!-- :data="skuArr"展示接口获取到总的SKU数据 
    prop展示各自对应的SKU属性的属性值
   :index="(pageNo - 1) * pageSize"排序-->
    <el-table border style="margin: 10px 0px;" :data="skuArr">
      <el-table-column label="序号" type="index" :index="(pageNo - 1) * pageSize + 1" align="center"
        width="120px"></el-table-column>
      <!-- show-overflow-tooltip：当列中内容溢出列的宽度时，会自动显示一个提示框来展示完整的内容-->
      <el-table-column label="名称" prop="skuName" width="180px" align="center"></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="180px"></el-table-column>

      <el-table-column label="图片" width="300px" align="center">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>

      <el-table-column label="重量" prop="weight" width="180px" align="center"></el-table-column>
      <el-table-column label="价格" prop="price" width="180px" align="center"></el-table-column>

      <el-table-column label="操作" width="255px" fixed="right" align="center">
        <template #="{ row }">
          <!-- 商品上架时显示Top,下架时显示Bottom 
          @click="updateSale(row)"商品的上架与下架的操作
          @click="updateSku()"：编辑商品的操作，现在暂无操作
          @click="findSku(row)":查看商品详情的操作
          @confirm="findSku(row)":确认删除商品详情的操作-->
          <el-button :type="row.isSale == 1 ? 'success' : 'info'" size="small" :title="row.isSale == 1 ? '下架商品' : '上架商品'"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'" @click="updateSale(row)"></el-button>
          <el-button type="warning" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`你确定要删除${row.skuName}?`" @confirm="removeSku" width="200px">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件pagination
      v-model:current-page:设置分页器当前页码
      v-model:page-size:设置每一个展示数据条数
      page-sizes:用于设置下拉菜单数据
      background:设置分页器按钮的背景颜色
      layout:可以设置分页器六个子组件布局调整
      @current-change 表示当前页码改变时触发的事件
      @size-change 表示每页显示数据条数改变时触发的事件
            -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasSku"
      @size-change="handler" />

    <!-- 抽屉组件：展示商品详情 -->
    <!-- v-model="drawer":控制抽屉显示与隐藏的字段 -->
    <!-- 抽屉组件:展示商品详情 -->
    <el-drawer v-model="drawer">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row>
          <el-col :span="6">名称：</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述：</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格：</el-col>
          <el-col :span="18">{{ skuInfo.price }}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性：</el-col>
          <el-col :span="18">
            <el-tag style="margin:5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{
              item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性：</el-col>
          <el-col :span="18">
            <el-tag style="margin:5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{
              item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <!-- 走马灯（轮播图）组件的展示  -->
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width:100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>

  </el-card>
</template>

<script setup lang="ts">
import { reqCancelSale, reqRemoveSku, reqSaleSku, reqSkuInfo, reqSkuList } from '@/api/product/sku';
import { SkuData, SkuInfoData, SkuResponseData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

// 分页器数据=>
let pageNo = ref<number>(1)        //分页器当前页码
let pageSize = ref<number>(5)       //每页展示几条数据
let total = ref<number>(0)          //总的SKU数据条数
let skuArr = ref<SkuData[]>([])     //总的SKU数组信息
// 获取SKU的信息
const getHasSku = async (page = 1) => {
  //当前分页器的页码
  pageNo.value = page
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
//组件挂载完毕，先获取SKU的数据
onMounted(() => {
  getHasSku()
})

//分页器下拉菜单发生变化触发
const handler = () => {
  getHasSku()
}

//商品的上架与下架的操作
const updateSale = async (row: SkuData) => {
  //如果当前商品的isSale==1,说明当前商品是上架的额状态->更新为下架
  //否则else情况与上面情况相反
  if (row.isSale == 1) {
    await reqCancelSale((row.id as number))             //下架操作
    ElMessage({ type: 'info', message: '下架成功' })    //提示信息
    //发请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNo.value)
  } else {
    await reqSaleSku((row.id as number))                //上架操作
    ElMessage({ type: 'success', message: '上架成功' })  //提示信息
    //发请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNo.value)
  }
}

//更新已有的SKU
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员在努力的更新中....' })
}

//控制抽屉显示与隐藏的字段
let drawer = ref<boolean>(false);
// 存储商品详情的数据
let skuInfo = ref<any>({})
//查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  //抽屉展示出来
  drawer.value = true;
  //获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo((row.id as number));
  //存储已有的SKU
  skuInfo.value = result.data;
}

//删除某一个已有的商品
const removeSku = async (id: number) => {
  //删除某一个已有商品的情况
  let result: any = await reqRemoveSku(id);
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' });
    //获取已有全部商品
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    //删除失败
    ElMessage({ type: 'error', message: '系统数据不能删除' });
  }
}
</script>

<style scoped>
/* drawer组件的布局*/
.el-row {
  margin: 10px 0px;
  line-height: 1.5;
}

/* 走马灯（轮播图）的展示 */
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
