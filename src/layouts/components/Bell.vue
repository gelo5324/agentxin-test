<template>
  <el-popover
    placement="bottom"
    trigger="click"
    :width="300"
    @before-enter="init()"
  >
    <template #reference>
      <div class="bell-view">
        <el-icon><Bell /></el-icon>
        <span class="bell-unread" v-show="bellNum">{{ bellNum }}</span>
      </div>
    </template>
    <el-tabs v-model="info.activeName" stretch>
        <el-tab-pane :label="getNoticeTitle()" :name="0">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li
                  v-for="(item, index) in info.notices"
                  :key="index"
                  class="myclass"
                  style="overflow: hidden"
                  @click="assignment(item, 0)"
                >
                  <div
                    style="float: left; margin-right: 15px; margin-left: 10px"
                  >
                    <ab-icon :icon="item.type" size="35px" />
                  </div>
                  <div style="float: left">
                    <div class="oneText">
                      {{ item.title }}
                    </div>
                    <div class="dateText oneText">
                      {{ item.createTime }}
                    </div>
                  </div>

                  <!-- <span v-html="item.title" /> -->
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="getTodoTitle()" :name="1">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li
                  v-for="(item, index) in info.todos"
                  :key="index"
                  class="myclass"
                  style="overflow: hidden"
                  @click="assignment(item, 1)"
                >
                  <div
                    style="float: left; margin-right: 15px; margin-left: 10px"
                  >
                    <ab-icon :icon="item.type" size="35px" />
                  </div>
                  <div style="float: left">
                    <div class="oneText">
                      {{ item.title }}
                    </div>
                    <div class="dateText oneText">
                      {{ item.createTime }}
                    </div>
                  </div>

                  <!-- <span v-html="item.title" /> -->
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div v-if="isShow()" class="notice-clear">
        <el-button
          :icon="ArrowDownBold"
          :loading="info.getMoreLoading"
          type="text"
          @click="getMoreFn()"
        >
          {{ translate('加载更多') }}
        </el-button>
      </div>
      <div class="notice-clear">
        <el-button
          :icon="CircleCheckFilled"
          :loading="info.allReadLoading"
          type="text"
          @click="allRead()"
        >
          {{ translate('一键已读') }}
        </el-button>
      </div>
  </el-popover>
  <el-dialog v-model="info.dialogVisible" :title="info.selectTitle" width="30%">
    <div class="detailsBox" v-html="info.selectContent"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="info.dialogVisible = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  //将来国际化
  import { reactive, computed } from 'vue'
  import * as cmsApi from '@/api/innerMsg'
  import { CircleCheckFilled, ArrowDownBold } from '@element-plus/icons-vue'
  import { ElMessage } from "element-plus";
  import { GetBpm } from '@/utils/index'

  const info = reactive({
    //tag页选中公告还是待办的标识
    activeName: 0,
    //公告/待办数据列表
    notices: [] as any[],
    todos: [] as any[],
    //公告和待办的页码参数，以及公告/待办数据每次请求的条数
    noticeCurrent: 1,
    todoCurrent: 1,
    pageSize: 8,
    //数量参数 公告数量  待办数量  总数
    noticeCount: 0,
    todoCount: 0,
    // allCount: 0,
    dialogVisible: false,
    visible: true,
    selectContent: '',
    selectTitle: '',

    getMoreLoading: false,
    allReadLoading: false,
  })

  const init = () => {
    // info.noticeCurrent = 1
    // info.todoCurrent = 1
    cmsApi
      .cmsInnerAllDetails(0, 1, info.noticeCurrent * info.pageSize)
      .then((rel) => {
        info.notices = rel.data.rows
        info.noticeCount = rel.data.total
      })

    cmsApi
      .cmsInnerAllDetails(1, 1, info.todoCurrent * info.pageSize)
      .then((rel) => {
        info.todos = rel.data.rows
        info.todoCount = rel.data.total
      })
  }

  init()

  const isShow = () => {
    if (info.activeName) {
      return info.todoCount > info.todos.length
    } else {
      return info.noticeCount > info.notices.length
    }
  }

  const getMoreFn = () => {
    info.getMoreLoading = true
    if (info.activeName) {
      info.todoCurrent += 1
      cmsApi
        .cmsInnerAllDetails(1, info.todoCurrent, info.pageSize)
        .then((rel) => {
          info.todos = info.todos.concat(rel.data.rows)
          info.todoCount = rel.data.total
          info.getMoreLoading = false
        })
    } else {
      info.noticeCurrent += 1
      cmsApi
        .cmsInnerAllDetails(0, info.noticeCurrent, info.pageSize)
        .then((rel) => {
          info.notices = info.notices.concat(rel.data.rows)
          info.noticeCount = rel.data.total
          info.getMoreLoading = false
        })
    }
  }

  const allRead = () => {
    const arr = info.activeName ? info.todos : info.notices
    if (!arr || arr.length == 0) {
      ElMessage.success('暂无未读消息')
    } else {
      info.allReadLoading = true
      const ids = arr.map((s) => s.id)
      cmsApi.cmsupdateReadByIdsFn(ids).then((rel) => {
        info.noticeCurrent = 1
        info.todoCurrent = 1
        init()
        info.allReadLoading = false
        ElMessage.success('已读消息成功')
      })
    }
  }

  const assignment = (row: any, type: number) => {
    console.log('assignment',info)
    //1 打开这条弹窗，并填充信息  2将这条数据置为已读  3重新请求接口获取最新数据
    if (info.dialogVisible) {
      return
    }
    info.selectContent = row.content.replace(/\/bpm\/bpm\//g,`${GetBpm()}/bpm/bpm/`).replace(/<a/g,'<a target="_blank"')
    info.selectTitle = row.title
    info.dialogVisible = true

    cmsApi.cmsupdateReadFn(row.id).then((rel) => {
      if (type) {
        info.todoCount = info.todoCount - 1
        info.todos = info.todos.filter((obj) => obj.id !== row.id)
      } else {
        info.noticeCount = info.noticeCount - 1
        info.notices = info.notices.filter((obj) => obj.id !== row.id)
      }
    })
  }

  const getNoticeTitle = () => {
    let strTitle = '通知'
    if (info.noticeCount) {
      if (info.noticeCount > 999) {
        strTitle += `(999+)`
      } else {
        strTitle += `(${info.noticeCount})`
      }
    }
    return translate(strTitle)
  }

  const getTodoTitle = () => {
    let strTitle = '待办'
    if (info.todoCount) {
      if (info.todoCount > 999) {
        strTitle += `(999+)`
      } else {
        strTitle += `(${info.todoCount})`
      }
    }
    return translate(strTitle)
  }

  // const handleClearNotice = () => {
  //   allCount.value = undefined
  //   notices.value = []
  //   $baseMessage('清空消息成功', 'success', 'vab-hey-message-success')
  // }
  const translate = (text)=>{
    return text
  }

  const bellNum = computed(() => {
    let count = Number(info.noticeCount) + Number(info.todoCount)
    return count>99?`99+`:count
  })
</script>

<style lang="scss" scoped>
  .dateText {
    height: 5px;
    font-size: x-small;
    color: #afafaf;
  }
  .oneText {
    max-width: 200px;
    height: 22px;
    overflow: hidden; /* 隐藏超出div的内容 */

    // line-height: 20px;
    // text-align: center;
    text-overflow: ellipsis; /* 使用省略号代替超出的文本 */
    white-space: nowrap; /* 阻止文本换行 */
  }
  .myclass:hover {
    background-color: #e8f4ff;
  }

  :deep() {
    .el-tabs__active-bar {
      min-width: 27px;
    }
  }

  .notice-list {
    height: 29vh;

    ul {
      padding: 0 0 0 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 5px 0 5px 0;
      }
    }
  }

  .notice-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0 0 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    border-top: 1px solid #e8eaec;

    i {
      margin-right: 3px;
    }
  }

  .notice-clear2 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0 0 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;

    i {
      margin-right: 3px;
    }
  }
</style>

<style lang="scss" scoped>
.bell-view {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  color: #302e6de5;
  .bell-unread {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: $base-color-danger;
    color: #fff;
    position: absolute;
    right: -4px;
    top: 0;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
