import * as ww from '@wecom/jssdk'
import Setting from './setting'
import { nanoid } from 'nanoid'
import sha1 from 'sha1'
import { GetGlobalInfo, GetSignature } from '@/api/wx'
import { isWx } from "@/utils/index";
// console.log(nanoid(16))
async function getConfigSignature(url) {
    // 根据 url 生成企业签名
    // 生成方法参考 https://developer.work.weixin.qq.com/document/path/90539
    const timestamp = parseInt(new Date()/1000)
    const nonceStr = nanoid(16)
    const jsapiTicket = (await GetSignature()).data
    const signature = sha1(`jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`)
    return { timestamp, nonceStr, signature }
}
  
async function getAgentConfigSignature(url) {
    // 根据 url 生成应用签名，生成方法同上，但需要使用应用的 jsapi_ticket
    return { timestamp, nonceStr, signature }
}

const wx = {
    async install(app) {
        if (!isWx) return
        app.config.globalProperties.$ww = ww
        const { corpId,agentId,jsApiList } = Setting
        const res = await GetGlobalInfo()
        const { appId, agentId: gAgentId } = res?.data
        console.log(ww.SDK_VERSION)
        Setting.corpId = appId||corpId
        Setting.agentId = gAgentId||agentId
        ww.register({
            corpId: appId||corpId,
            agentId: gAgentId||agentId,
            jsApiList,
            getConfigSignature,
            onConfigSuccess: () => {
                console.log('Success')
            },
            onConfigFail: (err) => {
                console.log(err)
            },
            onConfigComplete: () => {
                console.log('Complete')
            },
            fail: (err) => {
                console.log('register fail', err)
            },
            complete(result) {
                console.log('register complete', result)
            }
        })
    }
}

export default wx;