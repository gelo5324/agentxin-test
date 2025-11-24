<template>
    <div class="portal-layouts-footer" :class="{'mobile-footer': mobileVisible}">
        <div>Copyright © 2024 鑫苑科技服务集团有限公司</div>
        <div>反舞弊举报邮箱：jubao@xypm.hk</div>
    </div>
</template>

<script lang="ts" setup>
import { isMobile } from '@/utils/index'
import { ref } from 'vue'
const mobileVisible = ref(isMobile);
</script>

<style lang="scss" scoped>
.portal-layouts-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 34px;
    font-size: 12px;
    color: $base-color-9;
    background-color: #F7F9FF;
    box-shadow: 0px 1px 6px 0px #0000001A;
    & > div + div {
        margin-left: 10px;
    }
    &.mobile-footer {
        flex-direction: column;
        font-size: 10px;
        background-color: #EEF1FC;
        height: 40px;
        box-shadow: none;
        & > div + div {
            margin-left: 0px;
            margin-top: 5px;
        }
    }
}
</style>