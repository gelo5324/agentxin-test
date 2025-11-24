<template>
    <div class="qywx-view">
        加载中...
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const closePage = () => {
    proxy.$ww.closeWindow()
}
const wxInit = async () => {
    proxy.$ww.openDefaultBrowser({
        url: `https://metabi.dev.xinmeta.net/#/de-link/F0uGsyDy`,
        success: () => {
            closePage()
        }
    });
}

wxInit();

</script>

<style lang="scss" scoped>
.qywx-view {

}
</style>