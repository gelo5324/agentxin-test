import axios from 'axios';
import qs from 'qs';
import { ElMessage } from 'element-plus';
import { Base64 } from 'js-base64';
import router from '@/router/index';
import store from '@/store';
import { getAccessToken, getOaToken } from '@/utils/accessToken';
import { setting } from '@/config/setting';
const { authName, authPrex } = setting;

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 80000,
  xsrfHeaderName: 'X-CSRF-TOKEN',
  withCredentials: true,
  crossDomain: true,
  xhrFields: {
    withCredentials: true,
  },
  dataType: 'json',
  headers: {
    'Content-Type': 'application/json;',
  },
});

//添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // config.headers['X-Proxy']='API';
    const token = getAccessToken();
    // const oaToken = getOaToken();
    // if (!oaToken) alert(`哥，我是蓝凌token：${oaToken},我丢了`)
    if (token) {
      config.headers[authName] = `${authPrex}${token}`;
    }
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data);
    }
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url;
      url += '?';
      const keys = Object.keys(config.params);
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`;
        }
      }
      url = url.substring(0, url.length - 1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  (res) => {
    let { code, data, msg } = res.data;
    if (res.data && (code===undefined || code === 'Success')) { //下载 返回数据流处理
      code = 200
      data = res.data
    }
    let successCode = 200;
    if (code==401||code=='token_invalid'||code=='LOGIN_TIMEOUT') {
      store.dispatch('user/resetAccessToken');
      if (res.config.url.indexOf('expired=true')!=-1) {
        return res.data
      }
      router.push(`/login?redirect_url=${location.pathname}`);
      return
    }
    if (code==500&&msg==40029) {
      router.push(`/`);
      return
    }
    if (isNaN(code)||code!==successCode) {
      ElMessage.warning(msg);
      return Promise.reject(res.data);
    }
    return data
  },
  (error) => {
    if(error&&error.message==='cancel') return;
    let msg = '网络错误'
    if (error && error.response) {
      const {data, status} = error.response;
      if (status===401) {
        msg = ''
        store.dispatch('user/resetAccessToken');
        router.push(`/login?redirect_url=${location.pathname}`);
        return
      }
      if (status===500&&data?.msg==40029) {
        router.push(`/`);
        return
      }
      if (data.msg) msg = data.msg
    }
    if (!error.response && error.code==='ERR_NETWORK') {
      msg = ''
      store.dispatch('user/resetAccessToken');
      router.push(`/login?redirect_url=${location.pathname}`);
      return
    }
    if (msg) {
      ElMessage({
        message: msg,
        type: 'warning',
        duration: 3000,
      });
    }
    return Promise.reject(error);
  }
);

/* [请求库]
 ** @params url         { string }   @default => '' [接口地址]
 ** @params data/params { object }   @default => {} [发送数据]
 ** @params config      { object }   配置
 */
export default {
  post: function (url = '', data = {}, config) {
    return request.post(url, data, config);
  },

  put: function (url = '', data = {}, config) {
    return request.put(url, data, config);
  },

  get: function (url, params = {}, config) {
    let OPTIONS = Object.assign({ params }, config);

    return request.get(url, OPTIONS);
  },

  delete: function (url = '', params = {}, config) {
    let OPTIONS = Object.assign({ params }, config);

    return request.delete(url, OPTIONS);
  },
};
