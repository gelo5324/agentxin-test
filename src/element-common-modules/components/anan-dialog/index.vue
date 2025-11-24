<template>
    <el-dialog 
        v-model="dialogVisible"
        :append-to-body="true"
        :title="popConfig.title || '标题'"
        :custom-class="'anan-dialog'" 
        v-bind="popConfig"
        v-on="dialogHandler">
        <slot />
    </el-dialog>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
    name: 'anan-dialog',
    props: {
        popConfig: {
            type: Object,
            required: false,
            default: () => {
                return {
                    width: '1000px',
                    appendToBody: true,
                    showClose: true
                }
            }
        },
        title: {
            type: String,
            required: false,
            default: '标题'
        },
        dialogHandler: {
            type: Object,
            required: false,
            default: () => {
                return {
                    
                }
            }
        }
    },
    setup () {
        const dialogVisible = ref(false)

        onMounted(() => {
            dialogVisible.value = true
        })
        return {
            dialogVisible
        }
    }
}
</script>

<style lang="scss" scoped>
.anan-dialog {
    
}
</style>