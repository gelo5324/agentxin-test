<template>
    <el-popover 
        placement="bottom"
        trigger="click"
        :width="300"
        :show-arrow="false"
        :popper-class="'quill-icons-popover'">
      <template #reference>
        <button class="ql-icons"><el-icon :size="16"><Help /></el-icon></button>
      </template>
      <div class="quill-icons-popover-content">
        <div @click="iconClickHandler">
            <span class="kota-icon-a-huaban1"></span>
        </div>
        <div>
            <span class="kota-icon-a-huaban1"></span>
        </div>
        <div>
            <span class="kota-icon-a-huaban1"></span>
        </div>
        <div>
            <span class="kota-icon-a-huaban1"></span>
        </div>
      </div>
    </el-popover>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
    emits: ['icon-select'],
    setup(props, { emit }) {
        const iconClickHandler = () => {
            emit('icon-select');
        }
        return {
            iconClickHandler
        }
    }
});
</script>

<style lang="scss">
.ql-icons {
    display: flex !important;
    justify-content: center;
    align-items: center;
}
.quill-icons-popover {
    padding: 0 10px !important;
    &-content {
        display: flex;
        flex-flow: wrap;
        & > div {
            padding: 5px;
            cursor: pointer;
        }
    }
}
</style>