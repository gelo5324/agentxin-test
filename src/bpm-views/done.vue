<template>
    <div class="qywx-view">
        <span v-if="!isMobile">加载中...</span>
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import { GetAuthorizeUrl } from '@/api/wx'
import { TokenCheck } from '@/api/user';
import { setting } from '@/config/setting';
import { isMobile,GetBpm } from '@/utils/index'
const { wxpcKey } = setting.loginType
const { proxy } = getCurrentInstance()
const store = useStore();
const route = useRoute();
const routeQuery = route.query;
const closePage = () => {
    proxy.$ww.closeWindow()
}

const getParams = () => {
    let p = ''
    if (routeQuery) {
        for(var i in routeQuery){
            if (i!=='path') p+=`${i}=${routeQuery[i]}*`
        }
    }
    return p
}
const BpmUri = GetBpm()
const path = routeQuery.path_url||`${BpmUri}${isMobile?'/app':''}${isMobile?routeQuery.path||'':routeQuery.path.replace('/bpm/bpm/','/xinbpm/')||''}?${getParams()}`

const openUrl = () => {
    let hasToken = encodeURIComponent(store.getters['user/accessToken'])
    // let userId = store.getters['user/userInfo'].user.userId
    // let loginname = store.getters['user/loginname']
    let oaToken = encodeURIComponent(store.getters['user/oaToken'])
    
    let url = `${import.meta.env?.VITE_REDIRECT_URI}/done?accessToken=${hasToken}&oaToken=${oaToken}&redirect_url=${path}`
    proxy.$ww.openDefaultBrowser({
        url: url,
        success: () => {
            closePage()
        }
    });
}
const initFun = async () => {
    if (routeQuery.code) {
        store.dispatch('user/setNotSkip', true)
        await store.dispatch('user/login', {
            type: wxpcKey,
            validateCode: routeQuery.code
        })
        if (isMobile) {
            // location.href = path.replace(/\*/g, '&')
            window.location.replace(path.replace(/\*/g, '&'))
        } else {
            openUrl()
        }
    } else {
        let hasToken = store.getters['user/accessToken']
        let oaToken = store.getters['user/oaToken']
        if (hasToken&&oaToken) {
            const res = await TokenCheck({expired: true})
            if (res.isOk) {
                if (isMobile) {
                    window.location.replace(path.replace(/\*/g, '&'))
                } else {
                    openUrl()
                }
                return
            }
        }
        // location.href = GetAuthorizeUrl(`done?path_url=${path}`)
        window.location.replace(GetAuthorizeUrl(`done?path_url=${path}`))
    }
}
initFun();
</script>

<style lang="scss" scoped>
.qywx-view {

}
</style>