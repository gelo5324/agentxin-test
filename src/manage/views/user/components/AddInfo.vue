<template>
  <div class="popover-form-add">
    <anan-form
      :from-props="{
        labelPosition: 'top',
      }"
      :form="formData"
      :form-items="formItems"
      :btn-items="dialogVisible===3?lookBtnItems:btnItems"
    >
  </anan-form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps } from "vue";
import { ElMessage } from "element-plus";
import { AddData, EditData } from "../api";

const $myemit = defineEmits(["close", "add-success"]);
const props = defineProps({
  editInfo: {
    type: Object,
    required: false,
  },
  dialogVisible: {
    type: Number,
    required: true
  }
});

const formItems = ref([
  {
    component: "el-checkbox-group",
    label: "常用工具:",
    prop: "campus",
    defaultVal: [],
    class: "tool-lis",
    child: {
      component: 'el-checkbox',
      options: [
        {
          label: '请假申请',
          value: 1
        },
        {
          label: '出差申请',
          value: 2
        },
        {
          label: '市内公出',
          value: 3
        },
        {
          label: '未打卡说明',
          value: 4
        },
        {
          label: '我的信息',
          value: 5
        },
        {
          label: '我的资产',
          value: 6
        },
        {
          label: '我的票据',
          value: 7
        },
        {
          label: '知识中心',
          value: 8
        },
        {
          label: '我的发起',
          value: 9
        },
        {
          label: '我的草稿',
          value: 10
        }
      ]
    },
    attributes: {
      disabled: props.dialogVisible===3
    },
    style: {
      width: '100%'
    },
    rules: [
      
    ]
  }
]);

const btnItems = ref([
  {
    label: "取消",
    type: "info",
    handler: (cur) => {
      $myemit("close");
    },
  },
  {
    label: "保存",
    type: "primary",
    disabled: false,
    loading: false,
    verify: true,
    disabledVerify: false,
    handler: (cur) => {
      sureHander(cur);
    },
  },
]);
const lookBtnItems = ref([
  {
    label: "确认",
    type: "primary",
    disabled: false,
    loading: false,
    verify: true,
    disabledVerify: false,
    handler: (cur) => {
      $myemit("close");
    }
  }
])

let _formData = {
  id: "",
  campus: [1,2]
};
formItems.value.forEach((item) => {
  if (item.prop)
    _formData[item.prop] = item.defaultVal === undefined ? "" : item.defaultVal;
});

if (props.editInfo) {
  for (var i in _formData) {
    if (i==='campus') {
      _formData[i] = JSON.parse(props.editInfo[i]||'[]')
    } else {
      _formData[i] = props.editInfo[i]
    }
  }
}
const formData = ref(_formData);

const requestAwait = ref(false);
const sureHander = (btn) => {
  if (requestAwait.value) return;
  requestAwait.value = true;
  btn.loading = true;
  let api = formData.value.id ? EditData : AddData;
  api({
    userId: formData.value.id,
    campus: JSON.stringify(formData.value.campus)
  })
    .then((res) => {
      ElMessage({
        type: "success",
        message: formData.value.id ? "保存成功" : "添加成功",
      });
      $myemit("add-success", {
        formData,
        res: res,
      });
    })
    .finally(() => {
      btn.loading = false;
      requestAwait.value = false;
    });
};
</script>

<style lang="scss">
.popover-form-add {
  .tool-lis {
    .el-checkbox {
      width: 80px;
    }
  }
}
</style>
