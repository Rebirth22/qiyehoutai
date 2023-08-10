// 商品分类数据的仓库
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";
import type { CategoryObj, CategoryResponseData } from "@/api/product/attr/type";
import { defineStore } from "pinia";
import { ref } from "vue";

 const useCategoryStore = defineStore('Category', () => {
    // 获取一级分类的数组
    const c1Arr = ref<CategoryObj[]>([])
    const c2Arr = ref<CategoryObj[]>([])
    const c3Arr = ref<CategoryObj[]>([])
    // 获取一级分类的id
    const c1Id = ref<string | number>('')
    const c2Id = ref<string | number>('')
    const c3Id = ref<string | number>('')
    const getC1 = async () => {
        const res: CategoryResponseData = await reqC1()
        // console.log(res);
        if (res.code == 200) {
            c1Arr.value = res.data
        }

    }
    //  获取二级分类的数组
    const getC2 = async () => {
        const res: CategoryResponseData = await reqC2(c1Id.value)
        // console.log(res)
        if (res.code == 200) {
            c2Arr.value = res.data
        }
    }
    //  获取三级分类的数组
    const getC3 = async () => {
        const res: CategoryResponseData = await reqC3(c2Id.value)
        // console.log(res)
        if (res.code == 200) {
            c3Arr.value = res.data
        }
    }
    return {
        c1Arr,
        c1Id,
        getC1,
        c2Id,
        c2Arr,
        getC2,
        c3Id,
        c3Arr,
        getC3,
    }
})
export default useCategoryStore