<template>
    <div class="code-view">
        <div>您好，您的验证码是：<span class="code-text ">{{ code }}</span>。请勿向任何人提供此验证码！</div>
        <div class="height-30"></div>
        <div class="flex-box flex_j_c-flex-end margin_b-5">鑫门户-用户中心</div>
        <div class="flex-box flex_j_c-flex-end">{{ time }}</div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const routeQuery = route.query;
const code = routeQuery.c;
const time = routeQuery.t || '';
</script>

<style lang="scss" scoped>
.code-view {
    padding: 20px;
    .code-text {
        font-size: 16px;
        font-weight: bold;
        color: var(--el-color-primary);
    }
}
</style>
