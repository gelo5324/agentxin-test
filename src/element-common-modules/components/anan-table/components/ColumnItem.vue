<template>
  <el-table-column
    v-if="itemProps.children && itemProps.children.length>0"
    :label="itemProps.label"
  >
    <template v-for="(x, i) in itemProps.children">
      <column-item
        v-if="!x.isHidden"
        :key="x.id || i"
        :item-props="x"
        @btn-click="operateEvent"
      >
      </column-item>
    </template>
  </el-table-column>
  <el-table-column v-else :label="itemProps.label" v-bind="itemProps">
    <template v-slot:default="{ row, column }">
      <template v-if="!itemProps.type">
        <template v-if="itemProps.component">
          <component
            :is="itemProps.component"
            :src="row[itemProps.prop]"
            v-bind="{
              ...(itemProps.attributes || {}),
              ...(itemProps.component === 'el-image'
                ? {
                    previewSrcList: [row[itemProps.prop]],
                    previewTeleported: true,
                    loading: 'eager'
                  }
                : {}),
            }"
          >
          </component>
        </template>
        <template v-else-if="itemProps.slot">
          <slot :name="itemProps.slot" v-bind="row" />
        </template>
        <template v-else-if="itemProps.operate">
          <anan-operate
            :operate="row.operate || itemProps.operate"
            :row="row"
            @btn-event="operateEvent($event, row)"
          />
        </template>
        <template v-else-if="itemProps.eventName">
          <el-button type="text" @click.stop="operateEvent(itemProps, row)">{{
            row[itemProps.prop]
          }}</el-button>
        </template>
        <template v-else>{{ labelHandler(row, itemProps) }}</template>
      </template>
      <template v-else>
        <template v-if="itemProps.type === 'switch'">
          <el-switch
            v-model="row[itemProps.prop]"
            v-on="itemProps.attributes"
            @change="switchHander($event, row, x)"
          />
        </template>
        <template v-else-if="itemProps.type === 'status'">
          <span
            :style="
              itemProps.options[row[itemProps.prop]] &&
              itemProps.options[row[itemProps.prop]].style
                ? itemProps.options[row[itemProps.prop]].style
                : {}"
            >{{
              itemProps.options[row[itemProps.prop]]
                ? itemProps.options[row[itemProps.prop]].label
                : row[itemProps.prop]
            }}</span
          >
        </template>
        <template v-else-if="itemProps.type === 'icon'">
          <!-- <g-iconfont :name="row[itemProps.prop]" /> -->
        </template>
      </template>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "column-item",
};
</script>
<script setup>
import AnanOperate from "../../anan-operate/index.vue";
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";

const props = defineProps({
  itemProps: {
    required: true,
  },
});

const $myemit = defineEmits(["btn-click"]);

const operateEvent = (btn, data) => {
  $myemit("btn-click", {
    btn,
    data,
  });
};

const switchHander = (val, data, config) => {
  if (config.switchHander) config.switchHander(val, data);
};

const labelHandler = (data, conf) => {
  if (conf.labelHandler) return conf.labelHandler(data);
  let props=conf.prop.split('.');

  let _data=data;
  props.forEach(e=>{
    if(_data)_data=_data[e]
  })

  if (_data===undefined||_data===null||/^[ ]*$/.test(_data)) return '-';
 

  return _data;
}
</script>