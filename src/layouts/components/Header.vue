<template>
    <div class="portal-layouts-header">
        <!-- <HeaderMenu /> -->
        <Logo />
        <div class="portal-layouts-header-c"></div>
        <AiChat />
        <Search />
        <Book />
        <!-- <Voice /> -->
        <Bell />
        <User />
    </div>
</template>

<script lang="ts" setup>
import HeaderMenu from './HeaderMenu.vue'
import Logo from '@/components/Logo.vue'
import Voice from './Voice.vue'
import Bell from './Bell.vue'
import User from './User.vue'
import Search from './Search.vue'
import Book from './Book.vue'
import AiChat from './AiChat.vue'
</script>

<style lang="scss" scoped>
.portal-layouts-header {
    height: 56px;
    box-shadow: 0px 1px 6px 0px #0000001A;
    z-index: 5;
    display: flex;
    align-items: center;
    padding: 0 0 0 20px;
    &-c {
        flex: 1;
    }
    & > div {
        display: flex;
        align-items: center;
    }
    .xin-logo {
        height: 30px;
    }
}
</style>

<style lang="scss">

</style>