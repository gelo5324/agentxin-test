<template>
    <div class="qywx-view">
        加载中...
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import { GetAuthorizeUrl } from '@/api/wx'
import { TokenCheck } from '@/api/user';
import { setting } from '@/config/setting';
const { wxpcKey } = setting.loginType
const { proxy } = getCurrentInstance()
const store = useStore();
const route = useRoute();
const routeQuery = route.query;
const closePage = () => {
    proxy.$ww.closeWindow()
}

const openUrl = () => {
    let hasToken = encodeURIComponent(store.getters['user/accessToken'])
    // let userId = store.getters['user/userInfo'].user.userId
    // let loginname = store.getters['user/loginname']
    let oaToken = encodeURIComponent(store.getters['user/oaToken'])
    proxy.$ww.openDefaultBrowser({
        url: `${import.meta.env?.VITE_REDIRECT_URI}?accessToken=${hasToken}&oaToken=${oaToken}`,
        success: () => {
            closePage()
        }
    });
}
const wxInit = async () => {
    if (routeQuery.code) {
        store.dispatch('user/setNotSkip', true)
        await store.dispatch('user/login', {
            type: wxpcKey,
            validateCode: routeQuery.code
        })
        openUrl()
    } else {
        let hasToken = store.getters['user/accessToken']
        let oaToken = store.getters['user/oaToken']
        if (hasToken&&oaToken) {
            const res = await TokenCheck({expired: true})
            if (res.isOk) {
                openUrl()
                return
            }
        }
        location.href = GetAuthorizeUrl('qywx')
    }
}

wxInit();

</script>

<style lang="scss" scoped>
.qywx-view {

}
</style>