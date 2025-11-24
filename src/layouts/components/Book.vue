<template>
  <el-popover
    trigger="click"
    width="900"
    placement="bottom-end"
    transition=""
    :show-arrow="false"
    :offset="28"
    popper-class="book-popover"
    :popper-style="{
      padding: '20px 20px 40px 20px',
      borderRadius: '6px',
    }"
    @show="popoverShowHandle"
    @hide="popoverHideHandle"
  >
    <template #reference>
      <span
        class="iconfont xinbpm-icon-tongxunlu book-icon"
        :class="{ active: popoverVisible }"
      ></span>
    </template>
    <div class="book-title">员工查询</div>
    <div class="book-popover-content">
      <el-scrollbar class="tree-scrollbar">
        <el-tree
          class="book-tree"
          node-key="id"
          :props="props"
          show-checkbox
          :check-on-click-node="false"
          :highlight-current="true"
          :current-node-key="currentCheck"
          :data="treeData"
          @node-click="nodeClickHandle"
        >
          <template #default="{ node, data }">
            <div class="book-tree-node">
              <div class="node-icon-view">
                <span class="iconfont xinbpm-icon-wenjianjia"></span>
              </div>
              {{ node.label }}
            </div>
          </template>
        </el-tree>
      </el-scrollbar>

      <div class="inform-view" v-if="showTable">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="position" label="职位"> </el-table-column>
          <!-- <el-table-column prop="directLeader" label="上级"> </el-table-column> -->
          <el-table-column prop="depts" label="部门"></el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="phone" label="电话"> </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 10px"
          :current-page="pageNo"
          :page-size="pageSize"
          :total="total"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
      <div class="inform-view" v-else>
        <div class="user-inform">
          <div class="user-info">
            <div class="user-info-name">
              <span>{{ userInfo.name }}</span>
              <span
                class="user-sex"
                :class="{ 'user-sex-g': userInfo.sex == 2 }"
              >
                <el-icon v-if="userInfo.sex == 1"><Male /></el-icon>
                <el-icon v-if="userInfo.sex == 2"><Female /></el-icon>
              </span>
            </div>
            <div class="user-info-group">
              <span>{{ userInfo.postName || "岗位" }}</span>
            </div>
          </div>
          <div class="user-head">
            <el-image :src="userInfo.avatar" fit="cover" />
          </div>
        </div>
        <div class="line"></div>
        <div class="inform-lis">
          <div v-if="userInfo.phone">
            <span class="inform-d">电话：</span>{{ userInfo.phone }}
          </div>
          <div v-if="userInfo.email">
            <span class="inform-d">邮箱：</span>{{ userInfo.email }}
          </div>
          <div v-if="userInfo.depts">
            <span class="inform-d">部门：</span>{{ userInfo.depts }}
          </div>
          <!-- <div v-if="userInfo.email">
            <span class="inform-d">上级：</span>{{ userInfo.email }}
          </div> -->
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { getDept, getContact } from "@/api/innerMsg";
import { IsHidePhone } from '@/utils/index'
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchValue = ref("");
const list = ref([]);
const store = useStore();
const userInfo = computed(() => {
  return store.getters["user/userInfo"] || {};
});
const props = ref({
  label: "name",
  children: "children",
});
const showTable = ref(true);
const popoverVisible = ref(false);
const popoverShowHandle = () => {
  popoverVisible.value = true;
};
const popoverHideHandle = () => {
  popoverVisible.value = false;
};

const currentCheck = ref("");
const treeData = ref([]);
const nodeClickHandle = (node) => {
  searchValue.value = node.id;
  search();
};
const sizeChange = (page) => {
  pageSize.value = page;
};
const currentChange = (page) => {
  pageNo.value = page;
  getList()
};
const getList = () => {
  if (!searchValue.value) return;
  getContact({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    deptId: searchValue.value,
  }).then((res) => {
    console.log(res);
    total.value = res.total;
    list.value = res.records.map(item => {
      if (IsHidePhone(item.email)) item.phone = '-'
      return item
    });;
  });
};
const search = () => {
  pageNo.value = 1;
  getList();
};
function listToTree(list) {
  let map = {};
  let root = null;

  // 构建节点映射
  list.forEach((item) => {
    map[item.id] = item;
    item.children = [];
  });

  // 构建树
  list.forEach((item) => {
    const parent = map[item.parentId];
    if (parent) {
      parent.children.push(item);
    } else {
      root = item; // 找到根节点
    }
  });

  return root;
}
getDept().then((res) => {
  const lis = listToTree(res.data);
  treeData.value = [lis];
});
</script>

<style lang="scss" scoped>
.book-icon {
  cursor: pointer;
  &.active {
    color: var(--el-color-primary);
  }
}
.book-popover {
  .book-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
    color: $base-color-3;
    padding-bottom: 40px;
  }
  .book-popover-content {
    display: flex;
    width: 100%;
    height: 400px;
  }
  .tree-scrollbar {
    height: 100%;
    width: 220px;
    min-width: 220px;
    padding-right: 20px;
  }
  .inform-view {
    flex: 1;
    border-left: 1px solid #e7e7e7;
    // margin-left: 20px;
    padding: 20px 40px 0 40px;
    display: flex;
    flex-direction: column;
    .line {
      border-top: 1px solid #e7e7e7;
    }
  }
  .inform-view2 {
    border-left: 1px solid #e7e7e7;
  }
  .user-inform {
    display: flex;
    position: relative;
    padding: 20px 0;
    .user-head {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      overflow: hidden;
      & > .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      min-width: 0px;
      padding: 0 40px 0 60px;
      color: $base-color-3;
      font-size: 12px;
      line-height: 22px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      & > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .user-info-name {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        .user-sex {
          height: 18px;
          width: 18px;
          color: #fff;
          background-color: #55ccf2;
          border-radius: 4px;
          font-size: 14px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin-left: 10px;
          &.user-sex-g {
            background-color: #55ccf2;
          }
        }
      }
      .user-info-group {
        padding: 10px 0 0 0;
        & > span {
          border-radius: 20px;
          padding: 5px 0px;
        }
      }
    }
  }
  .inform-lis {
    line-height: 22px;
    font-size: 12px;
    color: $base-color-3;
    padding: 20px 0 0 60px;
    .inform-d {
      color: $base-color-9;
    }
  }
}
</style>
<style lang="scss">
.book-popover {
  .book-tree {
    --el-tree-node-content-height: 28px;
    --el-color-primary-light-9: #eef5ff;
    &
      > .el-tree-node:first-child
      > .el-tree-node__content
      > .el-tree-node__expand-icon {
      width: 0px;
      visibility: hidden;
    }
    .el-tree-node__expand-icon {
      color: #999;
      padding: 0 2px;
    }
    .el-tree-node__content {
      border-radius: 5px;
      margin-bottom: 1px;
      & > .el-checkbox {
        display: none;
      }
    }
    .book-tree-node {
      display: flex;
      align-items: center;
    }
    .node-icon-view {
      width: 12px;
      height: 12px;
      border-radius: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-color-primary);
      margin-right: 4px;
      color: #fff;
      & > span {
        font-size: 8px;
      }
    }
    &.el-tree--highlight-current {
      .el-tree-node.is-current > .el-tree-node__content {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
