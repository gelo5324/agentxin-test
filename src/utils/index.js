import UAParser from 'ua-parser-js'

const instance = new UAParser().getResult()
const browser = instance.browser

const isMobileFun = () => {
    // 1. 首先检查 ua-parser-js 的结果
    if (instance.device.type === 'mobile') {
        return true
    }
    // 2. 检查用户代理字符串
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileKeywords = [
        'harmonyos',  // 鸿蒙系统
        'android',
        'iphone',
        'ipod',
        'ipad',
        'mobile',
        'phone'
    ]
    return mobileKeywords.some(keyword => userAgent.includes(keyword))
}
export const isMobile = isMobileFun()

export const isWx = browser.name.toLowerCase() === 'wechat'


export function GetEnv() {
    return import.meta.env?.VITE_CLIENT_ENV
}

export function GetXinspace() {
    return import.meta.env?.VITE_XINSPACE_URI
}

export function GetBpm() {
    return import.meta.env?.VITE_BPM_URI
}

/**
 * @description: 判断是否有按钮级权限
 * @param {*} key
 * @return {*}
 */
export function isAuth(key) {
    let result = true
    // result = store.getters['menu/permissions'].indexOf(key) !== -1 || false
    // if (key === '') result = true
    return result;
}

function extractAttributes(str) {
    const result = {};
    const regex = /(\w+)\s*=\s*"([^"]*)"/g;
    let match;
    while ((match = regex.exec(str))) {
        result[match[1]] = match[2];
    }
    return result;
}

export function JspData(data) {
    let result = []
    if (data) {
        const a = data.replace('<dataList>', '').replace('</dataList>', '').split('<data')
        for (let i=0,len=a.length; i<len; i++) {
            const cur = a[i]
            if (cur.indexOf('/>')===-1) continue
            result.push(extractAttributes(cur))
        }
    }
    return result
}

export function ColumnsData(data) {
    let result = []
    if (data) {
        data.forEach(item => {
            let p = {}
            item.forEach(a => {
                const {col,value} = a
                p[col] = value
            })
            result.push(p)
        }) 
    }
    return result
}

const Emails = ['samuel.shen@xypm.hk','forrest.wang@xypm.hk','bo.feng@xypm.hk']
export function IsHidePhone(email) {
    if (email&&Emails.indexOf(email)>-1) {
        return true
    }
    return false
}

export function specialHandle(cur) {
    const { path } = cur;
    if (!path) return;
    const a = document.createElement('a')
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.href = path
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}