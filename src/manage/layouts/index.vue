<template>
    <div class="portal-manage-layouts">
        <el-scrollbar class="portal-manage-layouts-aside">
            
        </el-scrollbar>
        <el-scrollbar class="portal-manage-layouts-main">
            <router-view></router-view>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

</script>

<style lang="scss" scoped>
.portal-manage-layouts {
    width: 100%;
    height: calc(100vh - 56px);
    display: flex;
    background-color: #EEF1FC;
    &-aside {
        width: 0px;
    }
    &-main {
        flex: 1;
    }
}
</style>

<style lang="scss">

</style>