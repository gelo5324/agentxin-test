<template>
    <div class="portal-layouts">
        <app-header v-if="headerVisible"></app-header>
        <el-scrollbar class="portal-layouts-main">
            <router-view></router-view>
        </el-scrollbar>
        <app-footer v-if="headerVisible" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { isMobile } from '@/utils/index'
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'

const headerVisible = ref(!isMobile);
</script>

<style lang="scss" scoped>
.portal-layouts {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &-main {
        flex: 1;
    }
}
</style>

<style lang="scss">

</style>