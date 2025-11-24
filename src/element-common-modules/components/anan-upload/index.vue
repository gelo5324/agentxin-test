<template>
  <div>
    <el-upload
      ref="ananUpload"
      class="anan-upload"
      :class="{'anan-upload-cards': listType === 'picture-card'}"
      :action="action"
      :headers="headers"
      :data="data"
      :name="name"
      :accept="accept"
      :show-file-list="showFileList"
      :list-type="listType"
      :multiple="multiple"
      :method="method"
      :withCredentials="withCredentials"
      :drag="drag"
      :limit="limit"
      :autoUpload="autoUpload"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :http-request="httpRequest"
    >
      <template v-if="val">
        <template v-if="previewSlot">
          <slot :name="previewSlot" />
        </template>
        <template v-else>
          <img loading="eager" :src="val" class="preview" />
        </template>
      </template>
      <template v-if="!val || listType">
        <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
      </template>
    </el-upload>
    <anan-dialog v-if="dialogVisible>0" :dialogHandler="dialogHandler" :pop-config="{
        title: '图片裁剪',
        width: '600px',
        appendToBody: true,
        showClose: true,
        detailField: ''
      }">
      <template v-if="dialogVisible">
        <anan-cropper :cropper-img="cropperImg" :fixed-number="fixedNumber" v-on="dialogHandler" />
      </template>
    </anan-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import AnanCropper from "../anan-cropper/index.vue";
export default {
  name: "AnanUpload",
  components: {
    Plus,
    AnanCropper
  },
  props: {
    modelValue: {
      type: [String, Array],
      required: false,
      default: "",
    },
    action: {
      type: String,
      required: false,
      default: "",
    },
    headers: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    method: {
      type: String,
      required: false,
      default: "post",
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    data: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    name: {
      type: String,
      required: false,
      default: "file",
    },
    withCredentials: {
      type: Boolean,
      required: false,
      default: false,
    },
    drag: {
      type: Boolean,
      required: false,
      default: false,
    },
    fileSize: {
      type: Number,
      required: false,
      default: 2,
    },
    limit: {
      type: Number,
      required: false,
      default: 10,
    },
    accept: {
      type: String,
      required: false,
      default: "png,jpeg,jpg",
    },
    showFileList: {
      type: Boolean,
      required: false,
      default: false
    },
    listType: {
      type: String,
      required: false,
      default: "",
    },
    autoUpload: {
      type: Boolean,
      required: false,
      default: true,
    },
    cropper: {
      type: Boolean,
      required: false,
      default: false,
    },
    previewSlot: {
      type: String,
      required: false,
      default: "",
    },
    fixedNumber: {
      type: Array,
      required: false,
      default: () => {
          return [1, 1]
      }
    },
    ossFun: {
      type: Function,
      required: false,
      default: null
    },
    successFun: {
      type: Function,
      required: false,
      default: null
    }
  },
  setup(props, ctx) {
    const ananUpload = ref();
    const val = ref('');
    if (props.modelValue) val.value = props.modelValue
    const beforeUpload = (rawFile) => {
      const imgAccept = rawFile.type.split("/")[1];
      const accept = rawFile.name.split(".");
      const isType =
        props.accept.indexOf(imgAccept) > -1 ||
        props.accept.indexOf(accept[accept.length - 1]) > -1;
      if (!isType) {
        ElMessage.error("格式选择有误");
        return false;
      } else if (rawFile.size / 1024 / 1024 > props.fileSize) {
        ElMessage.error(`大小不能超过${props.fileSize}MB`);
        return false;
      }
      return true;
    };

    const valChange = () => {
      ctx.emit("update:modelValue", val.value);
      ctx.emit("change", val.value)
    }
    let list = [];
    const handleSuccess = (response, uploadFile) => {
      if (props.successFun&&response) {
        props.successFun(response);
        return;
      }
      if (response) val.value = response.data;
      if (uploadFile) val.value = URL.createObjectURL(uploadFile.raw);
      valChange();
    };

    const handleRemove = (uploadFile) => {
      let index = list.findIndex(item => {
        return item == uploadFile.response
      });
      list.splice(index, 1);
      val.value = list.join(',');
      valChange();
    }

    const handleChange = (file) => {
      const { raw } = file;
      if (props.cropper) {
        openCropper(raw);
      } else {
        cropperSuccessImg = raw;
      }
    }

    const httpRequest = async (request) => {
      const { filename, file } = request;
      let { action, data } = request;
      const name = `${new Date().getTime()}${file.name}`
      if (props.ossFun) {
        const ossInfo = await props.ossFun(name);
        action = ossInfo.action;
        data = ossInfo.data;
      }
      // 新建formDate对象
      let formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      // 文件单独push,第三个参数指定上传的文件名
      formData.append(filename, cropperSuccessImg, name);
      axios({
        headers: {
          contentType: 'multipart/form-data', // 需要指定上传的方式
          ...props.headers
        },
        url: action,
        method: 'post',
        data: formData,
        timeout: 200000000 // 防止文件过大超时
      }).then(({ data: resp }) => {
        handleSuccess(resp)
      }).catch(err => {
        console.log(err);
      });
    }

    let cropperSuccessImg = null;

    let dialogVisible = ref(0);
    const dialogHandler = {
      close: () => {
        dialogVisible.value = 0
      },
      addSuccess: (data) => {
        cropperSuccessImg = null;
        cropperSuccessImg = data.img;
        ananUpload.value.submit();
        dialogVisible.value = 0
      }
    }

    const cropperImg = ref(null);
    const openCropper = async (file) => {
      if (!props.cropper) return;
      cropperImg.value = null;
      var files = file;
      if (files.size / 1024 / 1024 > props.fileSize) {
        ElMessage.error(`大小不能超过${props.fileSize}MB`);
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        cropperImg.value = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(files);
      dialogVisible.value = 1;
    }

    watch([props], (newVal, oldVal) => {
      val.value = newVal[0].modelValue
    }, {immediate: false});

    return {
      ananUpload,
      val,
      cropperImg,
      dialogVisible,
      dialogHandler,
      beforeUpload,
      handleSuccess,
      handleRemove,
      handleChange,
      httpRequest
    };
  },
};
</script>

<style lang="scss">
.anan-upload {
  &.anan-upload-cards {
    width: 100% !important;
  }
  .preview {
    width: 100px;
    height: 100px;
  }
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
