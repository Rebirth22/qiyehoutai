//defineConfig 函数用于定义 Vite 的配置文件，它接受一个配置对象作为参数，并返回一个有效的配置对象。loadEnv 函数用于加载环境变量，它根据当前环境和配置的变量名，将环境变量的值加载到应用程序中。
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
//引入mockcha插件模拟
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 获取各种环境下的对应的变量
  //mode:区分不同的环境  process.cwd()是 Node.js 中的函数，返回当前工作目录的路径。此处为loadEnv函数的参数传递给了该函数，用于指定加载环境变量的目录。
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({//
        // 指定缓存图标的文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定图标的引用格式
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({//保证开发阶段可以使用mock
        localEnabled: command === 'serve', 
      }),
    ],
    resolve: {//别名配置
      alias: {// 相对路径别名配置，使用 @ 代替 src
        '@': path.resolve('./src'), 
      },
    },
    // scss全局变量的一个样式
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 获取数据服务器地址设置
          target: env.VITE_SERVE,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    }
  }
})
