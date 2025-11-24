<template>
    <el-drawer 
        v-model="drawerVisible"
        :custom-class="'anan-drawer'" 
        v-bind="{
            withHeader: false,
            appendToBody: true,
            showClose: false,
            title: '标题',
            ...drawerProps
        }"
        v-on="drawerHandler">
        <slot />
    </el-drawer>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
    name: 'anan-drawer',
    props: {
        drawerProps: {
            type: Object,
            required: false,
            default: () => {
                return {}
            }
        },
        drawerHandler: {
            type: Object,
            required: false,
            default: () => {
                return {}
            }
        }
    },
    setup () {
        const drawerVisible = ref(false);

        onMounted(() => {
            drawerVisible.value = true;
        })
        return {
            drawerVisible
        }
    }
}
</script>

<style lang="scss" scoped>
.anan-drawer {
    
}
</style>