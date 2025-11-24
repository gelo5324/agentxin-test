<template>
  <div class="anan-markdown" :class="{ 'anan-markdown-preview': preview }">
    <v-md-editor
      v-model="modelValue"
      left-toolbar="undo redo | clear | h bold italic strikethrough quote ul ol table hr image code"
      right-toolbar="preview sync-scroll fullscreen"
      :default-show-toc="false"
      :disabled-menus="[]"
      @upload-image="handleUploadImage"
      height="400px"
    ></v-md-editor>
  </div>
</template>

<script>
import { watch } from "vue";
import axios from "axios";
export default {
  name: "AnanMarkdown",
  props: {
    modelValue: String,
    preview: {
      type: Object,
      required: false,
      default: false,
    },
    action: {
      type: String,
      required: false,
      default: "",
    },
    filename: {
      type: String,
      required: false,
      default: "file",
    },
    uploadData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    uploadHeaders: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    watch(props, (val) => {
      ctx.emit("update:modelValue", val.modelValue);
      ctx.emit("change");
    });
  },
  methods: {
    handleUploadImage(event, insertImage, files) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      console.log(files);
      const file = files[0];
        // 新建formDate对象
        let formData = new FormData();
        for (let key in this.uploadData) {
          formData.append(key, this.uploadData[key]);
        }
        // 文件单独push,第三个参数指定上传的文件名
        formData.append(this.filename, file, file.name);
        axios({
          headers: {
            contentType: "multipart/form-data", // 需要指定上传的方式
            ...this.uploadHeaders,
          },
          url: this.action,
          method: "post",
          data: formData,
          timeout: 200000000, // 防止文件过大超时
        })
          .then(({ data: resp }) => {
            console.log(resp);
            // 此处只做示例
            insertImage({
                url: resp,
                desc: file.name
            });
          })
          .catch((err) => {
            console.log(err);
          });
    },
  },
};
</script>

<style lang="scss">
.anan-markdown {
  width: 100%;
  &.anan-markdown-preview {
    .v-md-editor__editor-wrapper {
      flex: 0;
      border: none;
    }
    .v-md-editor__toolbar {
      display: none;
    }
  }
}
</style>