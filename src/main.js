import { createApp } from 'vue'
// 全局样式
import '@/styles/index.scss';

import App from './App.vue'
const app = createApp(App)

import '@/router/control'
// router
import router from './router/index'
// vuex
import store from '@/store';

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/message.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 引入公共模块全局组件
import GlobalComs from '@/element-common-modules/components/index';
app.use(GlobalComs);
// directive
import Directive from '@/directive';
app.use(Directive);
// wx
import wx from '@/wx/index'

// 屏蔽警告信息
app.config.warnHandler = () => null;

app.use(ElementPlus, {
    locale: zhCn
}).use(router).use(store).use(wx).mount('#app')

// websocket
// import VueNativeSock from "vue-native-websocket-vue3";
// app.use(VueNativeSock, `https://portal.xinyuanfuwu.com/123`, {
//         // 启用Vuex集成
//         store: store,
//         mutations: {
//             SOCKET_ONOPEN: 'socket/SOCKET_ONOPEN',
//             SOCKET_ONCLOSE: 'socket/SOCKET_ONCLOSE',
//             SOCKET_ONERROR: 'socket/SOCKET_ONERROR',
//             SOCKET_ONMESSAGE: 'socket/SOCKET_ONMESSAGE',
//             SOCKET_RECONNECT: 'socket/SOCKET_RECONNECT',
//             SOCKET_RECONNECT_ERROR: 'socket/SOCKET_RECONNECT_ERROR'
//         },
//         // 数据发送/接收使用使用json
//         format: "json",
//         // 开启手动调用 connect() 连接服务器
//         connectManually: true,
//         // 关闭自动重连
//         reconnection: false
//     }
// );

export default app;