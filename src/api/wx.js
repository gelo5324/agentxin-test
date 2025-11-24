import request from '@/utils/request.js'
import wxConfig from '@/wx/setting'
import { orgPrefix } from './api-prefix'

const REDIRECT_URI = import.meta.env?.VITE_REDIRECT_URI;

export function GetAuthorizeUrl(route) {
    const { corpId,agentId } = wxConfig
    let redirectUri = encodeURIComponent(`${REDIRECT_URI}/${route||'login'}`)
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_privateinfo&agentid=${agentId}#wechat_redirect`
}

export function GetLoginUrl() {
    const { corpId,agentId } = wxConfig
    let redirectUri = encodeURIComponent(`${REDIRECT_URI}/login`)
    return `https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=CorpApp&appid=${corpId}&agentid=${agentId}&redirect_uri=${redirectUri}`
}

export function GetSignature(params) {
    return request.get(`${orgPrefix}/auth/quickLogin/qywxGetJsapiSignature`, params);
}

export function GetGlobalInfo(params) {
    return request.get(`${orgPrefix}/auth/quickLogin/quickLoginInfo`, params);
}
