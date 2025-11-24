<template>
    <div class="fy-skip-view">
        加载中...
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { useRoute } from "vue-router";
import { isMobile } from '@/utils/index'
import { GetFeiyongDataById } from '@/api/xinbpm';

const { proxy } = getCurrentInstance()
const route = useRoute();
const params = route.params

const closePage = () => {
    proxy.$ww.closeWindow()
}
const openUrl = async (path) => {
    proxy.$ww.openDefaultBrowser({
        url: path,
        success: () => {
            closePage()
        }
    });
}
const getData = async () => {
    const d = await GetFeiyongDataById({
        id: params.id
    })
    if (!d.isOk||!d?.data) return;
    const { link, mobileLink } = d.data
    if (isMobile) {
        setTimeout(() => {
            window.location.replace(mobileLink)
        }, 500)
        // window.location.replace(mobileLink)
        return 
    }
    openUrl(link)
}

getData();

</script>

<style lang="scss" scoped>
.fy-skip-view {

}
</style>