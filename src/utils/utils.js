import { Base64 } from 'js-base64';
import CryptoJS from 'crypto-js'
import { getAccessToken } from '@/utils/accessToken';
import { setting } from '@/config/setting';
const { clientId, clientSecret } = setting;

export function GetHeaders() {
    const token = getAccessToken()
    const Authorization = `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`
    const AccessToken = token
    const BladeAuth = `bearer ${token}`
    return {
        Authorization,
        AccessToken,
        BladeAuth
    }
}

export function DownloadExcel(url, fileName,type='GET',params) {
    return new Promise((resolve,reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open(type, url, true)
        // xhr.setRequestHeader('Conten-Type', 'multipart/form-data')
        xhr.setRequestHeader('Authorization', `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`)
        const token = getAccessToken()
        xhr.setRequestHeader('access-token', token)
        xhr.setRequestHeader('Blade-Auth', `bearer ${token}`)
        xhr.responseType = "blob"
        xhr.onload = function (oEvent) {
            var content = xhr.response
            var elink = document.createElement("a");
            elink.download = `${fileName}.xlsx`
            elink.style.display = "none"
            var blob = new Blob([content])
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            document.body.removeChild(elink)
            resolve()
        }
        let data = ''
        if (params) {
            data = new FormData()
            for (var i in params) {
                data.append(i, params[i])
            }
        }
        xhr.send(data)
    })
}

//加密存储类型
const cfg = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
}

const leEncryptionKey = '4HJKL68LC0ELVWO0'
  
/**
 * 加密对象
 * @param data 需要加密的对象
 */
export function encrypt(data) {
    return CryptoJS.AES.encrypt(
      data,
      CryptoJS.enc.Utf8.parse(leEncryptionKey),
      cfg
    ).toString()
}
  
/**
 * 解密对象
 * @param data 需要解密的对象
 */
export function decrypt(data) {
    return CryptoJS.AES.decrypt(
      data,
      CryptoJS.enc.Utf8.parse(leEncryptionKey),
      cfg
    ).toString(CryptoJS.enc.Utf8)
}
  
/**
 * 加密对象（自定义key）
 * @param data 需要加密的对象
 */
export function encryptKey(data) {
    return CryptoJS.AES.encrypt(
      data,
      CryptoJS.enc.Utf8.parse(key),
      cfg
    ).toString()
}
  
/**
 * 加密对象（自定义key）
 * @param data 需要解密的对象
 */
export function decryptKey(data) {
    return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), cfg).toString(
      CryptoJS.enc.Utf8
    )
}