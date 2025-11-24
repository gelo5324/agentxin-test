import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import postcsspxtoviewport from 'postcss-px-to-viewport'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    //默认压缩gzip，生产.gz文件
    viteCompression({
      deleteOriginFile: false, //压缩后是否删除源文件
    })
  ],
  server: {
    host: '0.0.0.0',
    port: '1025',
    strictPort: false,
    open: true,
    fs: {
      strict: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/portalapi/': {
        target: 'https://xinportal.dev.xinmeta.net/portalapi',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/portalapi/, '')
      },
      '/bpmApi':{
        target: 'https://bpm.dev.xinmeta.net',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bpmApi/, '')
      },
      '/systest/': {
        target: 'https://oa.xinyuanfuwu.com/', // 指定代理目标地址
        changeOrigin: true, // 启用跨域
        cookieDomainRewrite: true, // 将 cookie 的域重写为目标地址的域
        secure: false, // 设置为 false，以允许使用不安全的 HTTPS 连接
        rewrite: (path) => path.replace(/^\/systest/, ''), // 可选的路径重写规则
        headers: {
          // Host: 'oa.xinyuanfuwu.com', // 修改 Host 头
          Referer: 'https://oa.xinyuanfuwu.com', // 修改 Referer 头
        }
      },
      '/api': {
        target: 'https://xinportalbpm510.dev.xinmeta.net/api',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/agentapi': {
        target: 'https://agentxin.xinyuanfuwu.com/api',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agentapi/, '')
      }
    },
  },
  resolve: {
    // 设置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      // 引入公用的样式
      scss: {
        additionalData: `@use "@/styles/common.scss" as *;`,
        charset: false,
      },
      css: {
        charset: false,
      },
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            },
          },
        },
        postcsspxtoviewport({
          unitToConvert: 'PX', // 要转化的单位
          viewportWidth: 750, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          exclude: [],
          landscape: false // 是否处理横屏情况
        })
      ],
    },
  },
  build: {
    target: 'es2015',
    // 输出路径
    outDir: 'dist',
    // 生成静态资源的存放路径
    assetsDir: 'static/',
    // 构建后是否生成 source map 文件
    sourcemap: false,
    // 启用/禁用 CSS 代码拆分
    // 压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
    cssCodeSplit: true,
    // 启用/禁用 brotli 压缩大小报告
    brotliSize: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      },
    },
    terserOptions: {
      compress: {
        keep_infinity: true,
        // 是否删除生产环境console
        drop_console: true,
        // 是否删除生产环境debugger
        drop_debugger: true,
      },
    },
    // chunk 大小警告的限制
    chunkSizeWarningLimit: 2000,
  }
})