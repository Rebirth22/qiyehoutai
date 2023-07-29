import {
    createRouter,
    createWebHashHistory
} from 'vue-router'


import Login from '@/views/Login/login.vue'
import NotFound from '@/views/404/404.vue'
import Layout from '@/views/Layout/Index.vue'



const routes = [{
    path: "/",
    component: Layout,
    children:
        [{
            path: "/",
            component: Layout,
            meta: {
                title: "后台首页"
            }
        }]
},{
    //   /:pathMatch 表示这是一个动态参数，它会匹配路径中的任意字符，而 (.*)* 表示这个参数可以有零个或多个字符。
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
},{
    path: "/login",
    component: Login,
    meta: {
        title: "登录后台"
    }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router