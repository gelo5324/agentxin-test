<template>
    <anan-form
        ref="fromRef"
        class="user-excel-add"
        :from-props="{
            labelPosition: 'top',
        }"
        :form="formData"
        :form-items="formItems"
        :btn-items="btnItems"
        >
        <template #upload>
            <el-upload ref="uploadRef" v-bind="{...uploadAttr}">
                <div class="text-sub"><el-icon size="20"><Upload /></el-icon></div>
                <div class="text-sub">选择或拖拽.xlsx文件</div>
            </el-upload>
        </template>
        <template #download>
            <el-button type="primary" text :loading="downLoading" @click="downHandle">模板下载</el-button>
        </template>
    </anan-form>
</template>

<script setup>
import { ref, reactive, defineEmits, onMounted } from "vue";
import { DownTemplate, ImportUrl } from "../api";
import { GetHeaders } from "@/utils/utils"
const $myemit = defineEmits(["close", "add-success"]);
const fromRef = ref();
const uploadRef = ref();
const uploadAttr = ref({
    fileSize: 10,
    name: "file",
    autoUpload: false,
    action: ImportUrl(),
    accept: 'xlsx,csv',
    drag: true,
    headers: {

    },
    data: {

    },
    limit: 1,
    onSuccess: () => {
        $myemit("add-success");
    },
    onError: (err) => {
        console.log(err)
    },
    onRemove: () => {
        formData.value.template = ''
    },
    onChange: (file) => {
        formData.value.template = 'aaa'
        fromRef.value.validateField('template')
    }
})
const formItems = ref([
    {
        slot: 'upload',
        label: "模板上传:",
        prop: "template",
        class: 'user-excel-upload',
        style: {
            width: '100%'
        },
        rules: [
            {
                required: true,
                message: '请选择文件',
                trigger: 'change'
            }
        ]
    },
    {
        slot: 'download',
        style: {
            width: '100%'
        }
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
    label: "确认",
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

let _formData = {
  template: ''
};
const formData = ref(_formData);
const requestAwait = ref(false);
const sureHander = async (btn) => {
  if (requestAwait.value) return;
  requestAwait.value = true;
  btn.loading = true;
  await uploadRef.value.submit();
  btn.loading = false;
  requestAwait.value = false;
};

const downLoading = ref(false)
const downHandle = async () => {
    downLoading.value = true;
    await DownTemplate();
    downLoading.value = false;
};

onMounted(() => {
    if (!uploadAttr.value.headers.Authorization) {
        const {Authorization,AccessToken,BladeAuth} = GetHeaders();
        uploadAttr.value.headers['Authorization'] = Authorization
        uploadAttr.value.headers['access-token'] = AccessToken
        uploadAttr.value.headers['Blade-Auth'] = BladeAuth
    }
});

</script>

<style lang="scss" scoped>
.user-excel-add {
    .tem-download {

    }
    .text-sub {
        color: $base-color-9;
    }
}
</style>
<style lang="scss">
.user-excel-add {
    .user-excel-upload {
        .el-form-item__content {
            & > div {
                width: 100%;
            }
        }
    } 
}
</style>