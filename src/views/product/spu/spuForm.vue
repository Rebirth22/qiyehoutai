<!-- 添加一个新的SPU和修改SPU的的表单结构 -->
<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称 :">
            <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌 :">
            <el-select v-model="SpuParams.tmId">
                <!-- :value 绑定了 item.id，用于在选中该选项时获取其对应的值。 -->
                <el-option v-for="(item) in AllTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请你输入SPU描述" v-model="SpuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片 :">
            <!-- v-model:file-list="imgList"：展示默认图片 
                 action:-----上传图片的接口地址
                 list-type:----文件列表的类型，即图片展示的方式
                 on-preview----点击文件列表中已上传的文件时的钩子	
                on-remove----文件列表移除文件时的钩子 
                before-upload----属性绑定了handlerUpload方法，用于在上传文件之前的一些检查和处理操作。//照片钱上传成功之前的钩子约束文件的大小与类型
            -->
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <!-- alt=\"Preview Image\"是指当无法加载图片时显示的备用文本 -->
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%;height: 100%;" />
            </el-dialog>

        </el-form-item>
        <el-form-item label="SPU销售属性 :">
            <!-- 展示销售属性的下拉菜单 -->
            <!-- v-model="saleAttrIdAndValueName"  收集还没有具体属性值的属性,存储:value="`${item.id}:${item.name}`"里面的字符串
            :value="`${item.id}:${item.name}`" 收集选中的属性的标识字符串用于后续的解析添加到对象中-->
            <el-select v-model="saleAttrIdAndValueName"
                :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个属性` : '无'">
                <el-option :value="`${item.id}:${item.name}`" v-for="(item) in unSelectSaleAttr" :key="item.id"
                    :label="item.name"></el-option>
            </el-select>
            <!-- 选中还没添加的属性值就可以点击，否则禁止点击 -->
            <!-- @click="addSaleAttr" 点击按钮就往saleAttr数组添加还没有属性 -->
            <el-button :disabled="saleAttrIdAndValueName ? false : true" type="primary" icon="plus"
                style="margin-left:10px;" @click="addSaleAttr">添加属性</el-button>
            <!-- table展示销售属性与属性值的地方 -->
            <el-table style="margin: 10px 0;" border :data="saleAttr">
                <el-table-column label="序号" align="center" width="120px" type="index"></el-table-column>
                <el-table-column label="属性名" align="center" prop="saleAttrName">
                </el-table-column>
                <!-- 添加新的属性值的地方 -->
                <el-table-column label="属性值" align="center">
                    <template #="{ row }">
                        <!-- row:即为当前SPU已有的销售属性对象 -->
                        <el-tag style="margin:0px 5px" v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id"
                            class="mx-1" closable @close="row.spuSaleAttrValueList.splice(index, 1)">
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <!--v-if="row.flag == true":控制添加具体的input表单的显示和隐藏 
                        v-model="row.saleAttrValue"收集新增的属性值-->
                        <el-input v-if="row.flag == true" v-model="row.saleAttrValue" size="small" style="width:120px"
                            placeholder="请输入属性值名称" @blur="toLook(row)"></el-input>
                        <el-button v-else type="primary" size="small" icon="Plus" @click="toEdit(row)"></el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template #="{ $index }">
                        <el-button type="danger" size="small" icon="delete" @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- :disabled="saleAttr.length > 0 ? false : true" 存在具体属性值数据才可以保存 -->
            <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default"
                @click="save">保存</el-button>
            <el-button type="warning" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
// 引入接口
import { reqAllSaleAttr, reqAllTradeMark, reqSpuHasSaleAttr, reqSpuImageList, reqAddOrUpdateSpu } from '@/api/product/spu';
import type { AllTradeMark, HasSaleAttr, HasSaleAttrResponseData, SaleAttr, SaleAttrResponseData, SaleAttrValue, SpuData, SpuHasImg, SpuImg } from '@/api/product/spu/type'
import { TradeMark } from '@/api/product/trademark/type';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';

// 接收父组件传过来的函数
const emit = defineEmits(['changeShow'])
// 点击取消按钮切换回展示页面
const cancel = () => {
    // emit('changeShow', 0)
    emit('changeShow', { flag: 0, params: 'update' })//传参数使用父组件的函数
}


// 存储四个接口获取到的数据
const AllTradeMark = ref<TradeMark[]>([])       //存储已有的SPU这些数据
const imgList = ref<SpuImg[]>([])               //商品图片
const saleAttr = ref<SaleAttr[]>([])            //已有的SPU销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])      //全部销售属性

//存储已有的SPU对象-----既收集也可以更新
const SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
})

// 子组件的方法
const initHasSpuData = async (spudata: SpuData) => {
    //存储已有的SPU对象,将来在模板中展示-----父组件选中的对象的数据
    SpuParams.value = spudata

    // console.log(spudata);
    // spudata即为父组件传递过来的已有的SPU对象
    // 发请求获取对象数据

    //获取全部品牌的数据
    const result: AllTradeMark = await reqAllTradeMark()
    //获取某一个品牌旗下全部售卖商品的图片
    const result1: SpuHasImg = await reqSpuImageList((spudata.id as number))
    //获取已有的SPU销售属性的数据
    const result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spudata.id as number))
    //获取整个项目全部SPU的销售属性
    const result3: HasSaleAttrResponseData = await reqAllSaleAttr()

    //存储全部品牌的数据
    AllTradeMark.value = result.data
    //SPU对应商品图片----修改接口返回的图片名字以符合组件的自带的函数
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    //存储已有的SPU的销售属性
    saleAttr.value = result2.data;
    //存储全部的销售属性
    allSaleAttr.value = result3.data;
}

//控制对话框的显示与隐藏----显示图片预览效果
const dialogVisible = ref<boolean>(false)
//存储预览图片地址
const dialogImageUrl = ref<string>('')

// 照片墙点击预览按键触发的钩子函数
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    //对话框弹出来
    dialogVisible.value = true;
}
const handleRemove = () => {
    ElMessage({ type: 'success', message: '已删除一张照片' })
}
//照片钱上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true;
        } else {
            ElMessage({ type: 'error', message: '上传文件务必小于3M' })
            return false;
        }
    } else {
        ElMessage({ type: 'error', message: '上传文件务必PNG|JPG|GIF' })
        return false;
    }
}

// 收集还没有具体属性值的属性
const saleAttrIdAndValueName = ref<string>('')

//计算出当前SPU还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
    //allSaleAttr全部销售属性:颜色、版本、尺码
    //过滤剔除已有的销售属性:颜色、版本
    const unSelectArr = allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName
        });
    })
    return unSelectArr;
})

// 添加销售属性的方法
const addSaleAttr = () => {
    /*
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */
    //解构收集到的属性字符串
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //准备一个新的销售属性对象:将来带给服务器即可
    const newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组当中----saleAttr是已经展示出来的属性值的table数据
    saleAttr.value.push(newSaleAttr);
    //清空收集的数据
    saleAttrIdAndValueName.value = '';
}

//添加具体属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
    //点击按钮的时候,input组件不就不出来->编辑模式
    row.flag = true;
    row.saleAttrValue = ''
}
//表单元素失却焦点的事件回调
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式
    const newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }

    //非法情况判断---trim() 方法，用于去除字符串两端的空格
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({ type: 'error', message: '属性值不能为空的' })
        return;
    }
    //判断属性值是否在数组当中存在
    const repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })
    if (repeat) {
        ElMessage({ type: 'error', message: '属性值重复' })
        return
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}

const save = async () => {
    // 修正图片的上传地址和名字，新增图片的地址和名字需要转换成服务器需要的字段
    // console.log(imgList.value)
    //整理参数
    //发请求:添加SPU|更新已有的SPU
    //成功
    //失败
    //1:收集照片墙的数据-----spuImageList
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,//图片的名字
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    // console.log(SpuParams.value)
    //2:整理销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value
    // 发送保存数据的接口
    const res = await reqAddOrUpdateSpu(SpuParams.value)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: SpuParams.value.id ? '更新成功' : '添加成功' })

        //通知父组件切换场景为0
        emit('changeShow', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })

    } else {
        ElMessage({ type: 'success', message: SpuParams.value.id ? '更新成功' : '添加成功' })
    }


}

//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    });
    //清空照片
    imgList.value = [];
    //清空销售属性
    saleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    //存储三级分类的ID
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌的数据
    const result: AllTradeMark = await reqAllTradeMark();
    const result1: HasSaleAttrResponseData = await reqAllSaleAttr();
    //存储数据
    AllTradeMark.value = result.data;
    allSaleAttr.value = result1.data;
}

// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })

</script>

<style scoped></style>