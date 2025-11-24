import request from '@/utils/request.js'
import { isWx } from '@/utils/index'
import { encrypt } from '@/utils/utils'
import { setting } from '@/config/setting';
import { orgPrefix, bpmPrefix } from './api-prefix'
const { captchaKey, qywxKey, wxpcKey } = setting.loginType

export function Login(type,params) {
  // 账号密码登录
  if (type===captchaKey) {
    return request.post(`${orgPrefix}/auth/login`, {
      grantType: 'password',
      password: encrypt(params.password),
      userName: params.account,
      captcha: params.code,
      clientId: 'bpmDevPlatform',
      clientSecret: encrypt('1')
    })
  }
  // 企微登录
  if (type===qywxKey||type===wxpcKey) {
    return request.get(`${orgPrefix}/auth/quickLogin/qywx?code=${params.validateCode}`)
  }
}

export function LoginOld(type,params) {
  let a = ''
  if (type===captchaKey) {
    const {account,password} = params
    a = `grantType=captcha&account=${account}&password=${password}`
  }
  if (type===qywxKey) {
    a = `grantType=${type}`
  }
  if (type===wxpcKey) {
    a = `grantType=qywx`
  }
  return request.post(`/portalapi/blade-auth/token?tenantId=000000&${a}`, {
    ...params
  }, {
    headers: {
      'Captcha-Key': params.key||'',
      'Captcha-Code': params.code||'',
      'validateCode': params.validateCode||'',
      'User-Type': isWx?'app':'web'
    }
  });
}

export function GetCaptcha(params) {
  return request.get(`${orgPrefix}/auth/login/getCode`, params, {
    responseType: 'blob'
  });
}

export function Logout(params) {
  return request.get('/portalapi/blade-user/user/logout', params);
}

export function GetSmsCode(params) {
  return request.get('/portalapi/blade-user/sms/send', params);
}

export function GetUserInfo(params) {
  return request.get(`${bpmPrefix}/sys/userResource/userMsg`, params);
}

export function TokenCheck(params) {
  return request.get(`${orgPrefix}/boot/lanLing/check`, params);
}

export function GetLoginSwitch(params) {
  return request.get(`${orgPrefix}/auth/login/queryCaptchaSwitch`, params);
}
