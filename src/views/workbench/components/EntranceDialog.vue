<template>
    <el-dialog class="entrance-dialog" v-model="props.entranceVisible" :show-close="false" :append-to-body="true" width="600" @open="openHandle" @close="closeHandle">
        <template #header="{ close }">
            <div>管理应用</div>
            <div><el-icon class="cursor-pointer" color="#66666" @click="close"><Close /></el-icon></div>
        </template>
        <div class="entrance-dialog-content">
            <div class="list-title">展示应用
                <!-- <template>
                    <el-button v-if="!editVisible" type="primary" size="small" text @click="editVisible = true">编辑</el-button>
                    <el-button v-else size="small" text @click="editVisible = false">取消</el-button>
                </template> -->
            </div>
            <div class="app-list">
                <div class="app-li" v-for="(x, index) in showData" :key="x">
                    <entrance-view :entrance-data="EntranceData[x]" />
                    <div class="app-li-icon" v-show="showData.length>1" @click="showData.splice(showData.indexOf(x), 1)">
                        <el-icon><Minus /></el-icon>
                    </div>
                    <div class="app-li-icon app-li-icon-top" v-show="index>0" @click="antedisplacement(index)">
                        <el-icon><Top /></el-icon>
                    </div>
                </div>
            </div>
            <div class="line"></div>
            <div class="list-title">隐藏应用</div>
            <div class="app-list">
                <div class="app-li" v-for="x in hideData" :key="x">
                    <entrance-view :entrance-data="EntranceData[x]" />
                    <div class="app-li-icon app-li-icon-plus" @click="showData.push(Number(x))">
                        <el-icon><Plus /></el-icon>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <el-button @click="closeHandle">取消</el-button>
            <el-button type="primary" :loading="sureLoading" @click="sureHandle">确定</el-button>
        </template>
    </el-dialog>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import EntranceData from './entrance'
import EntranceView from './Entrance.vue'
import { EditMyEntrance } from '@/api/workbench'

const emit = defineEmits(['update:modelValue', 'update']);
const props = defineProps({
    entranceVisible: {
        type: Boolean,
        default: false
    },
    current: {
        type: Array,
        default: () => []
    }
});

const editVisible = ref(false);

const allData = [];
for(let i in EntranceData) {
    allData.push([i])
}

const showData = ref([]);
const hideData = computed(() => {
    return allData.filter(item => !showData.value.includes(Number(item)))
});

const antedisplacement = (index) => {
    const temp = showData.value[index];
    showData.value[index] = showData.value[index-1];
    showData.value[index-1] = temp;
}

const openHandle = () => {
    showData.value = [...props.current]
};
const closeHandle = () => {
    emit('update:modelValue', false)
};
const sureLoading = ref(false);
const sureHandle = () => {
    if(sureLoading.value) return;
    sureLoading.value = true;
    EditMyEntrance({
        uses: `[${showData.value.join(',')}]`
    }).then(res => {
        emit('update', [...showData.value])
        closeHandle()
    }).finally(() => {
        sureLoading.value = false;
    })
};
</script>
  
<style lang="scss">
.el-dialog.entrance-dialog {
    padding: 0;
    border-radius: 6px;
    .el-dialog__header {
        display: flex;
        height: 56px;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        font-size: 16px;
        border-bottom: 1px solid rgb(238, 241, 252);
    }
    .el-dialog__footer {
        display: flex;
        height: 56px;
        padding: 0 16px;
        justify-content: flex-end;
        align-items: center;
        border-top: 1px solid rgb(238, 241, 252);
    } 
}
.entrance-dialog-content {
    .line {
        width: 100%;
        height: 10px;
        background: #f3f3f3;
    }
    .list-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 25px;
        font-size: 14px;
        color: #333333;
    }
    .app-list {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 20px;
        .app-li {
            width: 20%;
            margin-bottom: 20px;
            position: relative;
            .app-li-icon {
                position: absolute;
                left: 50%;
                top: -6px;
                margin-left: 17px;
                width: 13px;
                height: 13px;
                background-color: #cccccc;
                border-radius: 50%;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 10px;
                border: 0.5px solid #ffffff;
            }
            .app-li-icon-plus {
                background-color: #4190F7;
            }
            .app-li-icon-top {
                background-color: #4190F7;
                top: auto;
                bottom: 20px
            }
        }
    }
}
</style>