<template>
  <el-form
    class="anan-form"
    ref="formRef"
    :model='form'
    v-bind="{
      size: 'small',
      labelWidth: '150px',
      labelPosition: 'left',
      inline: false,
      ...fromProps
    }"
    :rules="formRules">
    <el-scrollbar v-if="formItems.length>0">
      <template v-for='(z, i) in formItems' :key="z.id">
        <el-collapse class="form-collapse" v-model="collapseActive" v-if="z.children">
          <el-collapse-item :name="z.id">
            <template #title>
                <div class="collapse-title">
                    <el-icon class="a-title-arrow" color="#D9D9D9" :size="14"><CaretRight /></el-icon>
                    <div class="title-con">{{ z.label }}</div>
                </div>
            </template>
            <template v-for='(x, i) in z.children'>
              <el-form-item v-if="x.hiddenHandler ? x.hiddenHandler(x) : !x.isHidden" :class="x.class || ''" :key='x.id || i' :label='x.label' :label-width="x.labelWidth" :prop="x.prop" :style="x.style || {}">
                <template v-if="x.component === 'el-cascader'">
                  <el-cascader
                    v-if='x.component'
                    v-model='form[x.prop]'
                    :options="x.options"
                    v-on="x.events ? {...x.events} : {...formItemEvents}"
                    :props="x.props"
                  />
                </template>
                <template v-else-if="x.component === 'el-date-picker'">
                  <el-date-picker
                    v-if='x.component'
                    v-model="form[x.prop]"
                    v-bind="{
                      clearable: true, 
                      ...x.attributes,
                      disabled: x.disabledHandler ? x.disabledHandler(x) : x.attributes.disabled}"
                    v-on="x.events ? {...x.events} : {...formItemEvents}"
                  />
                </template>
                <template v-else>
                  <component
                    v-if='x.component'
                    :is='x.component'
                    v-model='form[x.prop]'
                    v-bind="{
                      clearable: true, 
                      ...x.attributes,
                      disabled: x.disabledHandler ? x.disabledHandler(x) : x.attributes.disabled}"
                    v-on="x.events ? {...x.events} : {...formItemEvents}"
                    >
                    <template v-if='x.child && x.child.options'>
                      <template v-if="x.child.component === 'el-radio'">
                        <el-radio v-for='(ch, chI) in x.child.options' :key='ch.id || chI' :label="ch[x.child.valName||'value']">{{sch[x.child.labelName||"label"]}}</el-radio>
                      </template>
                      <!-- <template v-if="x.child.component === 'anan-markdown'">
                        <anan-markdown />
                      </template> -->
                      <component
                        v-else
                        :is='x.child.component'
                        v-for='(ch, chI) in x.child.options'
                        :style="x.child.style||{}"
                        :key='ch.id || chI'
                        :label='ch[x.child.labelName||"label"]'
                        :value='ch[x.child.valName||"value"]'
                      >
                        <render-vnode :vNode='ch[x.child.labelName||"label"]'></render-vnode>
                        <el-image v-if="ch[x.child.imageName||'image']" :style="{width: '30px',height: '30px', borderRadius: '4px',...x.child.imageStyle||{}}" :src="ch[x.child.imageName||'image']" :fit="'cover'" />
                      </component>
                    </template>
                    <template v-if="x.component==='el-checkbox'">
                      {{ x.attributes.label }}
                    </template>
                    <template v-if="x.subSlot" v-slot:[x.subSlot]>
                      <slot :name="x.subSlot" />
                    </template>
                  </component>
                </template>
                <slot v-if="x.slot" :name="x.slot" :data="x" />
              </el-form-item>
            </template>
          </el-collapse-item>
        </el-collapse>
        <template v-else v-for='(x, i) in [z]'>
          <el-form-item v-if="x.hiddenHandler ? x.hiddenHandler(x) : !x.isHidden" :class="x.class || ''" :key='x.id || i' :label='x.label' :label-width="x.labelWidth" :prop="x.prop" :style="x.style || {}">
            <template v-if="x.component === 'el-cascader'">
              <el-cascader
                v-if='x.component'
                v-model='form[x.prop]'
                :options="x.options"
                v-on="x.events ? {...x.events} : {...formItemEvents}"
                :props="x.props"
              />
            </template>
            <template v-else-if="x.component === 'el-date-picker'">
              <el-date-picker
                v-if='x.component'
                v-model="form[x.prop]"
                v-bind="{
                  clearable: true, 
                  ...x.attributes,
                  disabled: x.disabledHandler ? x.disabledHandler(x) : x.attributes.disabled}"
                v-on="x.events ? {...x.events} : {...formItemEvents}"
              />
            </template>
            <template v-else>
              <component
                v-if='x.component'
                :is='x.component'
                v-model='form[x.prop]'
                v-bind="{
                  clearable: true, 
                  ...x.attributes,
                  disabled: x.disabledHandler ? x.disabledHandler(x) : x.attributes.disabled}"
                v-on="x.events ? {...x.events} : {...formItemEvents}"
              >
                <template v-if='x.child && x.child.options'>
                  <template v-if="x.child.component === 'el-radio'">
                    <el-radio v-for='(ch, chI) in x.child.options' :key='ch.id || chI' :label="ch[x.child.valName||'value']">{{sch[x.child.labelName||"label"]}}</el-radio>
                  </template>
                  <!-- <template v-if="x.child.component === 'anan-markdown'">
                    <anan-markdown />
                  </template> -->
                  <component
                    v-else
                    :is='x.child.component'
                    v-for='(ch, chI) in x.child.options'
                    :style="x.child.style||{}"
                    :key='ch.id || chI'
                    :label='ch[x.child.labelName||"label"]'
                    :value='ch[x.child.valName||"value"]'
                  >
                    <render-vnode :vNode='ch[x.child.labelName||"label"]'></render-vnode>
                    <el-image v-if="ch[x.child.imageName||'image']" :style="{width: '30px',height: '30px', borderRadius: '4px',...x.child.imageStyle||{}}" :src="ch[x.child.imageName||'image']" :fit="'cover'" />
                  </component>
                </template>
                <template v-if="x.component==='el-checkbox'">
                  {{ x.attributes.label }}
                </template>
                <template v-if="x.subSlot" v-slot:[x.subSlot]>
                  <slot :name="x.subSlot" />
                </template>
              </component>
            </template>
            <slot v-if="x.slot" :name="x.slot" :data="x" />
          </el-form-item>
        </template>
      </template>
    </el-scrollbar>
    <div class="anan-form-btns" v-if="btnItems.length>0">
      <el-button v-for="(x, i) in btnItems" :key="i" v-bind="{...x, size: x.size || fromProps.size}" @click="btnClick($event,x)">
        <template v-if="x.label">{{ x.label }}</template>
      </el-button>
    </div>
  </el-form>
</template>

<script>
import RenderVnode from '../RenderVnode'
// import AnanMarkdown from '../anan-markdown'
import { reactive, ref, watch, computed } from 'vue'
export default {
  name: 'anan-form-collapse',
  components: {
    RenderVnode,
    // AnanMarkdown
  },
  props: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    form: {
      type: Object,
      required: true
    },
    formItems: {
      type: Array,
      required: true
    },
    fromProps: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    btnItems: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    examinecIgnore: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  setup(props, context) {
    const formRef = ref()
    const formRules = ref({})

    const initFun = () => {
      props.formItems.forEach(item => {
        if (item.prop && item.rules && !item.isHidden) formRules.value[item.prop] = item.rules
        if (item.child && item.child.api) {
          let params = item.child.defaultParams || {}
          item.child.api(params).then((res) => {
            if (res) {
              item.child.options = res.data;
            }
          })
        }
      });
    }

    initFun();

    watch(() => {
      return props.name
    }, (newVal, oldVal) => {
      initFun();
    });

    const oldFormData = JSON.parse(JSON.stringify(props.form))

    /**
     * @description 返回字段是否必填
     */
    const rulesValidate = (rules) => {
      for (var i = 0, len = rules.length; i < len; i++) {
        if (rules[i].required) return true
      }
      return false
    }
    /**
     * @description 判断表单校验是否全部通过
     */
    const getAllValidate = () => {
      for (var i = 0, len = props.formItems.length; i < len; i++) {
        let cur = props.formItems[i]
        if (!cur.isHidden && cur.rules && rulesValidate(cur.rules) && /^[ ]*$/.test(props.form[cur.prop])) return false
      }
      return true
    }

    /**
     * @description 检查是否改变
     */
    const examinecChange = () => {
      for (var i in props.form) {
        let equal = JSON.stringify(props.form[i]) !== JSON.stringify(oldFormData[i])
        if (i && !props.examinecIgnore[i] && equal) {
          // console.log(i, 'newVal=>' + JSON.stringify(props.form[i]), 'oldVal=>' + JSON.stringify(oldFormData[i]))
          return true
        }
      }
      return false
    }

    const initBtnStatus = (disabled) => {
      props.btnItems.forEach(item => {
        if (item.disabledVerify) item.disabled = disabled
      })
    }

    // 初始化 按钮状态
    initBtnStatus(!getAllValidate() || !examinecChange())

    const btnClick = async (evt, btn) => {
      let target = evt.target;
      if (target.nodeName == 'SPAN') target = evt.target.parentNode;
      target.blur();
      if (!btn.verify) {
        if (btn.handler) btn.handler(btn)
        if (btn.eventName) context.emit('btn-event', btn.eventName, btn)
        return
      }
      await formRef.value.validate((valid, fields) => {
        if (valid) {
          if (btn.handler) btn.handler(btn)
          if (btn.eventName) context.emit('btn-event', btn.eventName, btn)
        } else {
          console.log('error submit!', fields)
        }
      })
    }

    let updateBtnStstus = false;
    /**
     * @description
     */
    const formValChange = () => {
      // 更新按钮状态
      initBtnStatus(!getAllValidate() || !examinecChange())

      context.emit('vals-change');
    }

    const formItemEvents = ref({
      change: (val) => {
        formValChange();
        updateBtnStstus = true;
        setTimeout(() => {
          updateBtnStstus = false;
        }, 20);
      },
      input: () => {
        // 更新按钮状态
        if (!updateBtnStstus) formValChange();
      }
    })

    const clearFiles = () => {
      formRef.value.clearFiles();
    }

    const validateField	= (props,callback) => {
      if (!props) return;
      formRef.value.validateField(props,callback)
    };

    const collapseActive = computed(() => {
      let a = [];
      const b = props.formItems.filter(item => !!item.children).map(item => {
        return item.id
      })
      if (b&&b.length>0) a = b;
      return a;
    });

    return {
      formRef,
      formRules,
      btnClick,
      formItemEvents,
      clearFiles,
      validateField,
      collapseActive
    }
  }
}
</script>

<style lang="scss">
.anan-form {
  .anan-upload {
    width: 100px;
    height: 100px;
    .el-upload-list,
    .el-upload {
      width: 100%;
      height: 100%;
    }
  }
  .form-collapse.el-collapse {
    clear: both; 
    border-left: 1px solid var(--el-collapse-border-color);
    border-right: 1px solid var(--el-collapse-border-color);
    margin-bottom: 12px;
    border-radius: 6px;
    padding: 0 6px;
    .collapse-title {
      display: flex;
      width: 100%;
      align-items: center;
      // padding: 0 10px;
      margin-left: -5px;
      .title-con {
        flex: 1;
        text-align: left;
        padding: 0 10px;
      }
    }
    .el-collapse-item__header {
      height: 36px;
      line-height: 36px;
      // border-width: 0;
    }
    .el-collapse-item__arrow {
      display: none;
    }
    .el-collapse-item.is-active {
      .a-title-arrow {
        transform: rotate(90deg);
      }
    }
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }
}
</style>
