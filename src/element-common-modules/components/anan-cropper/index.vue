<template>
  <div class="anan-cropper">
    <div>
      <vueCropper
        ref="cropper"
        :img="cropperImg"
        :autoCrop="true"
        :centerBox="true"
        :fixed="true"
        :fixedNumber="fixedNumber"
        :outputSize="outputSize"
        :outputType="outputType"
      ></vueCropper>
    </div>
    <div class="anan-cropper-btns">
      <el-button type="info" @click="cancleCropper">取消</el-button>
      <el-button type="primary" @click="saveCropper">确认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
import "vue-cropper/next/dist/index.css";

//组件中使用
import { VueCropper } from "vue-cropper";

const cropper = ref();
const props = defineProps({
  cropperImg: {
    required: true,
  },
  fixedNumber: {
    type: Array,
    required: false,
    default: () => {
      return [1, 1];
    },
  },
  outputSize: {
    type: Number,
    required: false,
    default: 0.5,
  },
  outputType: {
    type: String,
    required: false,
    default: "png",
  },
});

const $myemit = defineEmits(["close", "add-success"]);

const cancleCropper = () => {
  $myemit("close");
};

const saveCropper = () => {
  cropper.value.getCropBlob((data) => {
    $myemit("add-success", {
      img: data,
    });
  });
};

onMounted(() => {
  cropper.value.clearCrop();
})
</script>

<style lang="scss">
.anan-cropper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > div {
    width: 300px;
    height: 300px;
  }
  & > div.anan-cropper-btns {
    width: 100%;
    padding-top: 20px;
    text-align: right;
    height: auto;
  }
}
</style>