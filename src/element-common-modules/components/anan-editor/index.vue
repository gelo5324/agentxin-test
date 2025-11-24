<template>
  <div class="anan-editor">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="`height: ${height}px; overflow-y: hidden`"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script>
import axios from 'axios'

import {
  defineComponent,
  onMounted,
  ref,
  shallowRef,
  reactive,
  toRefs,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { Boot } from '@wangeditor/editor'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import YinlvIcons from "./YinlvIcons"
import YinlvInput from "./YinlvInput"
import YinlvRome from "./YinlvRome"

const menuConf = {
  key: 'yinlv',
  factory() {
    return new YinlvIcons() 
  }
}

const menuConf2 = {
  key: 'yinlv-input',
  factory() {
    return new YinlvInput() 
  }
}

const menuConf3 = {
  key: 'yinlv-rome',
  factory() {
    return new YinlvRome()
  }
}

Boot.registerMenu(menuConf);
Boot.registerMenu(menuConf2);
Boot.registerMenu(menuConf3);

export default defineComponent({
  name: "AnanEditor",
  components: { Editor, Toolbar },
  emits: ["update:modelValue", "input", "change", "blur", "focus", "ready"],
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: [String, Number],
      default: '请输入...'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 300
    },
    ossUpload: {
      type: Function,
      default: null
    }
  },
  setup(props, { emit }) {
    // 编辑器实例，必须用 shallowRef，重要！
    const editorRef = shallowRef();

    // 内容 HTML
    const valueHtml = ref(props.modelValue);

    watch(() => props.modelValue, (val) => {
      valueHtml.value = val;
    });

    // // 模拟 ajax 异步获取内容
    onMounted(() => {
      
    });

    const toolbarConfig = {
      toolbarKeys: [
        {
          key: 'group-more-style',
          title: ' ',
          iconSvg: '<svg t="1661020057259" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2411" width="64" height="64"><path d="M597.32864 554.666667H255.995307V426.666667h341.333333v-1.536a149.333333 149.333333 0 0 0 0-295.594667V128H255.995307v768h341.333333a170.666667 170.666667 0 1 0 0-341.333333z m42.666667 469.333333H85.32864V0h512v0.853333a277.333333 277.333333 0 0 1 211.626667 478.208A298.666667 298.666667 0 0 1 639.995307 1024z" p-id="2412"></path></svg>',
          menuKeys: ['bold', 'underline', 'italic', 'through']
        },
        'clearStyle',
        'color',
        'bgColor',
        '|',
        {
          key: 'group-more-style', // 必填，要以 group 开头
          title: '缩进', // 必填
          iconSvg: '<svg t="1661014513891" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="984" width="64" height="64"><path d="M875.975111 823.978667a36.010667 36.010667 0 1 1 0 72.021333H148.024889a36.010667 36.010667 0 1 1 0-72.021333h727.950222z m-745.585778-466.488889c3.242667 0 6.428444 0.910222 9.272889 2.503111L374.499556 496.071111a18.432 18.432 0 0 1 0 31.857778l-234.837334 136.078222a18.432 18.432 0 0 1-27.648-15.928889V375.921778c0-10.126222 8.248889-18.375111 18.375111-18.375111z m745.585778 234.496a36.010667 36.010667 0 1 1 0 72.021333h-391.964444a36.010667 36.010667 0 1 1 0-72.021333h391.964444z m0-231.992889a36.010667 36.010667 0 1 1 0 72.021333h-391.964444a36.010667 36.010667 0 0 1 0-72.021333h391.964444z m0-231.992889a36.010667 36.010667 0 1 1 0 72.021333H148.024889a36.010667 36.010667 0 0 1 0-72.021333h727.950222z" p-id="985"></path></svg>',
          menuKeys: ['indent', 'delIndent']
        },
        {
          key: 'group-more-style', // 必填，要以 group 开头
          title: '对齐方式', // 必填
          iconSvg: '<svg t="1661014299899" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4413" width="64" height="64"><path d="M96 128h832v96H96zM96 576h832v96H96zM96 352h576v96H96zM96 800h576v96H96z" p-id="4414"></path></svg>', // 可选
          menuKeys: ["justifyLeft", "justifyRight", "justifyCenter","justifyJustify"] // 下级菜单 key ，必填
        },
        '|',
        'uploadImage',
        '|',
        'yinlv',
        'yinlv-rome',
        'yinlv-input',
        'emotion',
        'redo',
        'undo',
        'fullScreen'
      ]
    };
    const editorConfig = { 
      placeholder: props.placeholder,
      MENU_CONF: {
        uploadImage: {
          fieldName: 'file',
          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 2 * 1024 * 1024, // 1M
          allowedFileTypes: ['image/*'],
          // 自定义上传
          async customUpload(file, insertFn) { 
            // console.log(insertFn)
            // 自己实现上传，并得到图片 url alt href
            const result = await ossUploat(file);
            // 最后插入图片
            insertFn(result.url, '', '');
          }
        }
      }
    };

    const ossUploat = async (file) => {
      const ossInfo = await props.ossUpload(`${new Date().getTime()}-${file.name}`);
      let { action, data } = ossInfo;
      // 新建formDate对象
      let formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      // 文件单独push,第三个参数指定上传的文件名
      formData.append('file', file, file.name);
      await axios({
        headers: {
          contentType: 'multipart/form-data', // 需要指定上传的方式
          ...props.headers
        },
        url: action,
        method: 'post',
        data: formData,
        timeout: 200000000 // 防止文件过大超时
      }).then(({ data: resp }) => {
        console.log(resp)
      }).catch(err => {
        console.log(err);
      });
      return {
        url: `${action}/${data.key}`
      };
    }

    // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;

      editor.destroy();
    });

    // 编辑器回调函数
    const handleCreated = (editor) => {
      // console.log("created", editor);
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    const handleChange = (editor) => {
      // console.log("change:", editor.getHtml());
      emit('update:modelValue', editor.getHtml());
    };
    const handleDestroyed = (editor) => {
      // console.log("destroyed", editor);
    };
    const handleFocus = (editor) => {
      // console.log("focus", editor);
    };
    const handleBlur = (editor) => {
      // console.log("blur", editor);
    };
    const customAlert = (info, type) => {
      alert(`【自定义提示】${type} - ${info}`);
    };
    const customPaste = (editor, event, callback) => {
      // 自定义插入内容
      // editor.insertText("xxx");

      // 返回值（注意，vue 事件的返回值，不能用 return）
      callback(false); // 返回 false ，阻止默认粘贴行为
      // callback(true) // 返回 true ，继续默认的粘贴行为
    };

    const insertText = () => {
      const editor = editorRef.value;
      if (editor == null) return;

      editor.insertText("hello world");
    };

    const printHtml = () => {
      const editor = editorRef.value;
      if (editor == null) return;
      // console.log(editor.getHtml());
    };

    const disable = () => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.disable();
    };

    return {
      editorRef,
      mode: "default",
      valueHtml,
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      customPaste,
      insertText,
      printHtml,
      disable,
    };
  },
});
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
.anan-editor {
  width: 100%;
  border: 1px solid #ccc;
}
</style>