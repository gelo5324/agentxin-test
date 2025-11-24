<template>
  <div class="page-view">
    <div class="flex-box flex_j_c-space-between">
      <anan-form
        v-if="filterItems.length>0"
        class="page-view-filter"
        :from-props="fromProps"
        :form="filterParams"
        :form-items="filterItems"
        :btn-items="filterBtns"
        @btn-event="eventHander"
        @vals-change="filterChangeHandler"
      >
      </anan-form>
      <anan-form
        v-if="operaBtns.length>0"
        :style="{}"
        :form="{}"
        :form-items="operaItems"
        :btn-items="operaBtns"
        @btn-event="eventHander"
      ></anan-form>
    </div>
    <anan-table
      :table-data="tableData"
      :col-config="colItems"
      :page-params="{
        total: total,
        limit: params.size,
        curPage: params.current,
      }"
      :table-event="tableEventHander"
      :page-handler="pageHandler"
      :loading="requestAwait"
      @btn-click="operateEvent"
    >
    </anan-table>
    <anan-dialog
      v-if="dialogVisible>0"
      :dialogHandler="dialogHandler"
      :pop-config="{
        ...popProps,
        title: popTitle[dialogVisible],
      }"
    >
      <template v-if="dialogVisible===1||dialogVisible===2||dialogVisible===3">
        <add-info :edit-info="editInfo" :dialogVisible="dialogVisible" v-on="dialogHandler" />
      </template>
      <template v-if="dialogVisible===4">
        <excel-add v-on="dialogHandler" />
      </template>
    </anan-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PageConfig from "./config";
import pageFun from "@/manage/composition/pageFun";
import AddInfo from "./components/AddInfo.vue";
import ExcelAdd from "./components/ExcelAdd.vue";
import { DownUser } from "./api"

const events = {}
const {
  requestAwait,
  fromProps,
  filterItems,
  filterBtns,
  operaItems,
  operaBtns,
  colItems,
  filterParams,
  filterChangeHandler,
  params,
  total,
  tableData,
  pageHandler,
  tableEventHander,
  dialogVisible,
  dialogHandler,
  editInfo,
  popProps,
  eventHander,
  operateEvent,
  getDatas,
} = pageFun(PageConfig,events);

events.look = () => {
  dialogVisible.value = 3;
}

events.add = () => {
  dialogVisible.value = 4;
}
events.export = async () => {
  await DownUser({
    ...params,
    ...filterParams.value,
  });
}

const popTitle = ref({
  1: "新增",
  2: "权限",
  3: "权限查看",
  4: "权限导入"
});
getDatas();
</script>