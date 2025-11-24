import AnanForm from './anan-form/index.vue'
import AnanTable from './anan-table/index.vue'
import AnanDialog from './anan-dialog/index.vue'
import AnanDrawer from './anan-drawer/index.vue'
import AnanOperate from './anan-operate/index.vue'
// import AnanMarkdown from './anan-markdown/index.vue'
import AnanUpload from './anan-upload/index.vue'
// import AnanQuill from './anan-quill/index.vue'
// import AnanEditor from './anan-editor/index.vue'
import AnanFormCollapse from './anan-form/formCollapse.vue'

const components = [
  AnanForm,
  AnanTable,
  AnanDialog,
  AnanDrawer,
  AnanOperate,
  // AnanMarkdown,
  AnanUpload,
  // AnanQuill,
  // AnanEditor,
  AnanFormCollapse
]

const install = (app) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}
export default {
  install
}