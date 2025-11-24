<template>
    <div class="redirect-view">
        
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore();
const getDatas = async () => {
    await store.dispatch('user/getOaToken')
};

getDatas()
</script>

<style lang="scss" scoped>
.redirect-view {

}
</style>