import Cookies from 'js-cookie'
import { setting } from '@/config/setting';
const { tokenName, domin, userIdName, authName } = setting;
import { GetEnv } from './index'
const ENV = GetEnv()
const TokenKey = `${tokenName}`

var inFifteenMinutes = new Date(new Date().getTime() + 100 * 60 * 60 * 1000)

function getdomin() {
  const Domain = ENV==='development'?null:domin
  return Domain
}

export function getAccessToken() {
  return Cookies.get(TokenKey)
}

export function setAccessToken(token) {
  Cookies.set(authName, `${token}`, {
    expires: inFifteenMinutes,
    domain: getdomin()
  })
  return Cookies.set(TokenKey, token, { 
    expires: inFifteenMinutes,
    domain: getdomin()
  })
}

export function removeAccessToken() {
  Cookies.remove(authName, {
    domain: getdomin()
  })
  Cookies.remove(authName)
  return Cookies.remove(TokenKey, {
    domain: getdomin()
  })
}

const UserIdKey = `${ENV==='production'?'':ENV+'-'}${userIdName}`
export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(id) {
  return Cookies.set(UserIdKey, id, { 
    expires: inFifteenMinutes,
    domain: getdomin()
  })
}

export function removeUserId() {
  return Cookies.remove(UserIdKey, {
    domain: getdomin()
  })
}

const OaTokenKey = `LtpaToken1`
export function getOaToken() {
  return Cookies.get(OaTokenKey)
}

export function setOaToken(token) {
  return Cookies.set(OaTokenKey, token, { 
    expires: inFifteenMinutes,
    domain: getdomin()
  })
}

export function removeOaToken() {
  return Cookies.remove(OaTokenKey, {
    domain: getdomin()
  })
}

export function getCookieByKey(key) {
  return Cookies.get(key)
}

export function setCookieByKey(key, value) {
  return Cookies.set(key, value, { 
    expires: inFifteenMinutes,
    domain: getdomin()
  })
}

export function removeCookieByKey(key) {
  return Cookies.remove(key, {
    domain: getdomin()
  })
}