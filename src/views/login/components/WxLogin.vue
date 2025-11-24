<template>
    <div class="wx-login-view">
        <iframe class="wx-login-iframe" :src="iframeUrl" frameborder="0"></iframe>
        <div class="wx-login-view-btn">
            <el-button @click="backHandle">账号密码登录</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import { GetLoginUrl } from '@/api/wx'
const $myemit = defineEmits(["onSwitch"]);


const iframeUrl = ref(GetLoginUrl());

const backHandle = () => {
    $myemit("onSwitch");
};
</script>

<style lang="scss" scoped>
.wx-login-view {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // background-color: #fff;
    z-index: 10;
    display: flex;
    flex-direction: column;
    padding-top: 65px;
    .wx-login-iframe {
        flex: 1;
    }
    &-btn {
        padding: 0 68px 38px 68px;
        .el-button {
            width: 100%;
            height: 36px;
        }
    }  
}
</style>