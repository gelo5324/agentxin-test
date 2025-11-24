<template>
  <el-popover
    trigger="click"
    width="600"
    placement="bottom-end"
    transition=""
    :show-arrow="false"
    :offset="26"
    popper-class="search-popover"
    :popper-style="{
      padding: '20px 20px 30px 20px',
      borderRadius: '6px',
    }"
  >
    <template #reference>
      <el-input
        class="search-input"
        placeholder="搜员工"
        readonly
        size="small"
        :prefix-icon="Search"
      />
    </template>
    <div class="search-view">
      <el-input
        v-model="searchValue"
        placeholder="搜员工"
        :prefix-icon="Search"
      />
      <el-button type="primary" class="search-btn" @click="search"
        >搜索</el-button
      >
    </div>
    <div class="search-view" style="margin-top: 27px">
      <div class="search-title">搜索结果</div>
      <div class="list-content">
        <div class="list" :key="index" v-for="(item, index) in list">
          <div class="left">
            <img src="../../assets/header.png" />
          </div>
          <div class="right">
            <div class="top">
              <div class="top-left">
                <span class="name">姓名：</span
                ><span class="value">{{ item.name }}</span>
              </div>
              <div class="top-right">
                <span class="name">电话：</span
                ><span class="value">{{ item.phone }}</span>
              </div>
              <div class="top-left">
                <span class="name">性别：</span
                ><span class="value">{{ item.sex }}</span>
              </div>
              <div class="top-right">
                <span class="name">邮箱：</span
                ><span class="value">{{ item.email }}</span>
              </div>
              <!-- <div class="top-left">
                <span class="name">上级：</span
                ><span class="value">{{ item.directLeader }}</span>
              </div> -->
              <div class="top-right">
                <span class="name">职位：</span
                ><span class="value">{{ item.position }}</span>
              </div>
            </div>
            <div class="bottom">
              <div>
                <span class="name">部门：</span
                ><span
                  class="value"
                  v-for="(sitem, sindex) in item.depts"
                  :key="sindex"
                  >{{ sitem }}<br
                /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        v-if="total"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </el-popover>
</template>

<script setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getContact } from "@/api/innerMsg";
import { IsHidePhone } from '@/utils/index'

const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchValue = ref("");
const list = ref([]);
const sizeChange = (page) => {
  pageSize.value = page;
};
const currentChange = (page) => {
  pageNo.value = page;
  getList();
};
const getList = () => {
  if(!searchValue.value) return;
  getContact({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    name: searchValue.value,
  }).then((res) => {
    console.log(res);
    total.value = res.total;
    list.value = res.records.map(item => {
      if (IsHidePhone(item.email)) item.phone = '-'
      return item
    });
  });
};
const search = () => {
  pageNo.value = 1;
  getList();
};
</script>

<style lang="scss" scoped>
.search-input {
  width: 160px;
  margin-right: 20px;
}
.search-popover {
  .search-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
    color: $base-color-3;
    padding-bottom: 20px;
  }
  .search-view {
    display: flex;
    flex-direction: column;
    position: relative; 
    .list-content{
        max-height: 500px;
        overflow: auto;
    }
    .list {
      padding: 20px;
      border: 1px solid #e9e9e9;
      display: flex;
      border-radius: 12px;
      margin-bottom: 20px;
      .left {
        width: 68px;
        img {
          width: 68px;
          height: 68px;
        }
        margin-right: 20px;
      }
      .right {
        flex: 1;
        .top {
          display: flex;
          flex-wrap: wrap;
          .top-left {
            width: 140px;
            margin-bottom: 5px;
            align-items: left;
          }
          .top-right {
            width: 270px;
            margin-bottom: 5px;
            align-items: left;
          }
        }
        .name {
          line-height: 22px;
          color: #999999;
        }
        .value {
          line-height: 22px;
          color: #333333;
          margin-left: 13px;
        }
      }
    }
  }
  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
    height: 28px;
  }
}
</style>
<style lang="scss">
.el-popper.search-popover {
  .search-view {
    .el-input {
      width: 100%;
    }
    .el-input,
    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
