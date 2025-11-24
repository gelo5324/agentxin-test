<template>
  <div class="anan-operate">
    <template v-for="(x, i) in operate">
      <template v-if="x.children">
         <el-popover
            :key="i"
            :width="200"
            placement="bottom"
            :trigger="x.trigger || 'click'"
            :popper-class="'anan-operate-popover'"
            v-if="visibleHandler($event,x)"
          >
            <template #reference>
              <el-button v-bind="{
                ...x,
                disabled: disabledHandler($event,x)
              }">{{ x.label }}</el-button>
            </template>
            <template #default>
              <div class="operate-btns">
                <template v-for="(child, childI) in x.children">
                  <el-button :key="childI" v-bind="{
                    ...child,
                    disabled: disabledHandler($event,child)
                  }" @click.stop="btnClick($event,child)" v-if="visibleHandler($event,child)">
                    <template v-if="child.label">{{ child.label }}</template>
                  </el-button>
                </template>
              </div>
            </template>
          </el-popover>
      </template>
      <template v-else>
        <el-popover
          :key="i"
          placement="top"
          trigger="hover"
          popper-class="operate-popover"
          transition=""
          width="auto"
          :teleported="true"
          :content="x.label"
          :disabled="true"
        >
          <template #reference>
            <el-button v-permission="x.perm||''" v-bind="{
              ...x,
              disabled: disabledHandler($event,x)
            }" @click.stop="btnClick($event,x)" v-if="visibleHandler($event,x)">
              <template v-if="x.label">{{ x.label }}</template>
            </el-button>
          </template>
        </el-popover>
      </template>
    </template>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  operate: {
    type: Array,
    required: true
  },
  row: {
    type: Object
  }
})

const $myemit = defineEmits(['btn-event'])
const btnClick = (evt, btn) => {
  let target = evt.target;
  if (target.nodeName == 'SPAN') target = evt.target.parentNode;
  target.blur();
  $myemit('btn-event', btn)
}

const visibleHandler = (evt,btn) => {
  if (Object.prototype.toString.call(btn.visibleHandle)==='[object Function]') return btn.visibleHandle(props.row);
  return true;
};
const disabledHandler = (evt,btn) => {
  if (btn.disabledHandler) return btn.disabledHandler(props.row);
  return btn.disabled;
};
</script>

<style lang="scss">
.anan-operate {
  .el-button--text {
    padding: 0 5px;
    height: 20px;
  }
  .el-button+.el-button {
    margin-left: 0px;
    // border-left: 1px solid rgba(0,0,0,.15);
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 1px;
      height: 13px;
      background-color: rgba(0,0,0,.15);
      position: absolute;
      left: -2px;
      top: 2px;
    }
  }
}
.anan-operate-popover {
  .operate-btns {
    display: flex;
    flex-direction: column;
  }
}
.el-popover.operate-popover {
  display: flex;
  justify-content: center;
  padding: 5px 10px !important;
  min-width: 0px !important;
  font-size: 12px;
}
</style>