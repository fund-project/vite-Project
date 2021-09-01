/*
 * @Author: liuhl
 * @Date: 2021-09-01 09:37:30
 * @LastEditors: liuhl
 * @LastEditTime: 2021-09-01 14:54:21
 * @Description: file content
 */
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import dotenv from 'dotenv'
import { input } from './config/pageConfig'
const fs = require('fs')

try {
  // 根据环境变量加载环境变量文件
  const file = dotenv.parse(fs.readFileSync(`.env.${process.env.NODE_ENV}`))
  // 根据获取的key给对应的环境变量赋值
  for (const key in file) {
    process.env[key] = file[key]
  }
} catch (e) {
  console.error(e)
}

function pathResolve (dir) {
  return resolve(__dirname, ".", dir);
}

console.log(" %c 我是帅哥 " + "%c ➡️ " + "%c 可是我没有钱 ", 'color: pink; font-size:50px; background-image: linear-gradient(to right, orange, lightblue, purple)', "color: red; font-size: 50px", "color: #fadfa3; background: #030307; font-size: 50px;")
console.log(process.env.VITE_APP_PROXY_URL)
// https://vitejs.dev/config/
module.exports = {
  // 项目启动的根路径
  root: 'src/pages/',
  // 访问路径 , 默认 ./
  base: process.env.VITE_BASE_URL || './',
  assetsDir: './',
  plugins: [vue()],
  // 设置别名
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  optimizeDeps: {
    include: ['vue', 'axios', 'vue-router', 'vuex', 'echarts'],
  },
  // 是否开启ssr服务断渲染
  ssr: false,
  server: {
    // 默认是 3000 端口
    port: Number(process.env.VITE_APP_PORT) || 3000,
    // 不默认打开浏览器
    open: false,
    proxy: {
      '^/.*-api': {
        target: process.env.VITE_APP_PROXY_URL,
        changeOrigin: true
      },
      '/developer-service': {
        target: process.env.VITE_APP_PROXY_DEVLOPER_URL,
        secure: false,
        changeOrigin: true,
      },
    },
    // 压缩
    minify: 'esbuild',
    // 打包配置
    build: {
      target: 'modules',
      // 出口
      outDir: process.env.VITE_OUTPUT_DIR || 'dist',
      // 输出的静态资源的文件夹名称
      assetsDir: 'assets',
      minify: 'terser', // 混淆器
      // 配置多页面入口
      rollupOptions: {
        input
      },
      // 生产环境去除console | debugger
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
}
