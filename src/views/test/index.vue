<template>
    <div class="test-view">
        <div>移动端： {{ isMobile }}</div>
        <div>userAgent: {{ userAgent }}</div>
    </div>
</template>

<script setup>
import { isMobile } from '@/utils/index'
const userAgent = navigator.userAgent.toLowerCase()
</script>

<style lang="scss" scoped>
.test-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
}
</style>