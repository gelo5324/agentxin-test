<template>
  <div class="workbench-view workbench-view2">
    <div class="workbench-view-top top1">
      <div class="workbench-card xinpm-img-view view-l">
        <el-carousel
          class="workbench-view-carousel"
          :interval="5000"
          indicator-position="none"
          :motion-blur="true"
        >
          <template v-for="x in banerDatas" :key="x.id_">
            <el-carousel-item>
              <el-image class="xinpm-img" :src="x.bgImg" fit="cover" />
              <img v-if="x.textImg" class="xinpm-img-text" :src="x.textImg" />
            </el-carousel-item>
          </template>
        </el-carousel>
      </div>
    </div>
  </div>
  <div class="workbench-view">
    <div class="workbench-view-l workbench-interval-right">
      <div class="workbench-card workbench-card-flow" :class="{'workbench-card-classify-item-lis-max-h': isBpmUser}">
        <div class="workbench-title">
          流程中心
          <!-- <el-input class="classify-input" v-model="classifyInput" placeholder="定位分类" :suffix-icon="Search"></el-input> -->
        </div>
        <div class="classify-item-lis classify-item-lis-wrap">
            <div v-for="y in bpmClassify" :key="y.id" @click="classifyClickHandle(y)">
                <div class="classify-icon">
                    <span class="iconfont" :class="y.icon"></span>
                </div>
                <span class="content">{{ y.title }}</span>
            </div>
        </div>
      </div>
      <div class="workbench-card workbench-card-entrance">
        <div class="workbench-title">快捷入口 
          <span class="more" @click="entranceVisible=true">更多<el-icon><ArrowRight /></el-icon></span>
        </div>
        <div class="entrance-lis">
          <template v-for="x in entrance" :key="x">
            <entrance-view class="entrance-li" :entrance-data="EntranceData[x]" />
          </template>
        </div>
        <entrance-dialog v-model="entranceVisible" :current="[...entrance]" @update="updateEntrance" />
      </div>
    </div>
    <div class="workbench-view-r">
      <div class="workbench-view-top top2">
        <div class="workbench-card xinpm-img-view view-l">
          <el-carousel
            class="workbench-view-carousel"
            :interval="500000"
            indicator-position="none"
            :motion-blur="true"
          >
            <template v-for="x in banerDatas" :key="x.id_">
              <el-carousel-item @click="specialHandle({path: x.path_||''})">
                <el-image class="xinpm-img" :src="x.bgImg" fit="cover" />
                <div v-if="x.textImg" class="xinpm-img-text">
                  <img :src="x.textImg" />
                </div>
              </el-carousel-item>
            </template>
          </el-carousel>
        </div>
      </div>
      <div class="workbench-view-con">
        <div
          class="workbench-card workbench-interval-right workbench-tabs-view view-l"
        >
          <div class="workbench-title">
            <span class="more" @click="informMoreClickHandle"
              >更多<el-icon><ArrowRight /></el-icon
            ></span>
          </div>
          <el-tabs
            class="matter-tabs"
            v-model="informActive"
            @tab-change="informTabChangeHandle"
          >
            <el-tab-pane
              v-for="x in informTabs"
              :key="x.name"
              :label="x.label"
              :name="x.name"
            ></el-tab-pane>
          </el-tabs>
          <div class="news-scrollbar" v-loading="informLoading">
            <el-scrollbar>
              <div
                class="news-li"
                v-for="x in informDatas"
                :key="x.id"
                @click="newsClickHandle(x)"
              >
                <div class="news-content">
                  <span class="news-tag">公告</span>
                  <div class="news-c-text">{{ x.text }}</div>
                </div>
                <div class="news-time">{{ x.created }}</div>
              </div>
            </el-scrollbar>
            <no-data
              v-if="informDatas.length === 0 && !informLoading"
            ></no-data>
          </div>
        </div>
        <div class="workbench-card workbench-tabs-view view-r">
          <div class="workbench-title">
            <span class="more" @click="moreClickHandle(newsActive)"
              >更多<el-icon><ArrowRight /></el-icon
            ></span>
          </div>
          <el-tabs
            class="matter-tabs"
            v-model="newsActive"
            @tab-change="newsTabChangeHandle"
          >
            <el-tab-pane
              v-for="x in newsTabs"
              :key="x.name"
              :label="x.label"
              :name="x.name"
            ></el-tab-pane>
          </el-tabs>
          <div class="news-scrollbar" v-loading="newsLoading">
            <el-scrollbar>
              <div
                class="news-li"
                v-for="x in newsDatas"
                :key="x.id"
                @click="newsClickHandle(x)"
              >
                <div class="news-content">
                  <div class="news-c-text">{{ x.text }}</div>
                </div>
                <div class="news-time">{{ x.created }}</div>
              </div>
            </el-scrollbar>
            <no-data v-if="newsDatas.length === 0 && !newsLoading"></no-data>
          </div>
        </div>
      </div>
      <div class="workbench-view-bom">
        <div
          class="workbench-card workbench-interval-right workbench-tabs-view workbench-todo-view view-l"
        >
          <div class="workbench-title">
            <span class="more" @click="matterMoreHandle"
              >更多<el-icon><ArrowRight /></el-icon
            ></span>
          </div>
          <!-- <div class="height-10"></div> -->
          <el-tabs
            class="matter-tabs matter-fix-width"
            v-model="matterActive"
            @tab-change="matterTabChangeHandle"
          >
            <!-- class="matter-tabs" -->
            <el-tab-pane
              v-for="x in matterTabs"
              :key="x.name"
              :label="x.label"
              :name="x.name"
            >
              <template #label>
                <span>{{ x.label }}</span>
                <span v-if="x.notifyKey" class="matter-tabs-sub"
                  >({{ notifyInfo[x.notifyKey] || "0" }})</span
                >
              </template>
            </el-tab-pane>
          </el-tabs>
          <div class="news-scrollbar" v-loading="matterLoading">
            <el-scrollbar>
              <div
                class="news-li"
                v-for="x in matterDatas[matterActive]"
                :key="x.id"
                @click="matterClickHandle(x)"
              >
                <div class="news-content">
                  <span class="news-point"></span>
                  <el-tag class="margin_r-5" type="danger" size="small" effect="dark" v-if="matterActive==='todo'&&x.priority>50">催办</el-tag>
                  <div class="news-c-text">
                    <!-- <span v-if="x.modelName">【{{ x.modelName }}】</span> -->
                    <div v-html="x.title"></div>
                  </div>
                </div>
                <template v-if="x.statusDesc">
                  <div class="news-time width-50"> {{ x.statusDesc }} </div>
                  <el-tooltip v-if="x.approver" placement="top-start" transition="" :show-arrow="false" :enterable="false" effect="light" :disabled="x.approver.length<5">
                    <template #content> {{ x.approver }} </template>
                    <div class="news-time width-60 approver-text"> {{ x.approver||'' }} </div>
                  </el-tooltip>
                  <div v-else class="width-60"></div>
                </template>
                <div class="news-time">{{ x.time }}</div>
              </div>
            </el-scrollbar>
            <no-data
              v-if="matterDatas[matterActive].length === 0 && !matterLoading"
            ></no-data>
          </div>
        </div>
        <div class="workbench-card view-r">
          <div class="workbench-title">专题专栏</div>
          <div class="news-scrollbar">
            <div class="special-lis">
              <div
                class="special-li"
                v-for="x in special"
                :key="x.id"
                :style="x.style || {}"
                @click="specialHandle(x)"
              >
                <div class="special-icon">
                  <el-image :src="x.image" fit="cover" />
                </div>
                <div class="special-label">{{ x.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount ,reactive, getCurrentInstance } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from "vue-router"
import { useStore } from 'vuex'
import { GetBannerData, GetMyEntrance, GetNewsDatas, GetTodoDatas, GetKmDatas, GetNotify } from '@/api/workbench'
import { GetDoneData, GetFinishData, GetUnreadData, GetMyData, ReadData, BPMReadData } from '@/api/xinbpm';
import * as cmsApi from "@/api/innerMsg";
import { JspData, ColumnsData, GetBpm, isWx } from '@/utils/index'
import NoData from '@/components/NoData.vue'
import EntranceData from './components/entrance'
import EntranceView from './components/Entrance.vue'
import EntranceDialog from './components/EntranceDialog.vue'
import Image1 from './images/image1.png'
import Image2 from './images/image2.png'
import Image3 from './images/image3.png'
import Image4 from './images/image4.png'

const { proxy } = getCurrentInstance()
const router = useRouter();
const isWeChat = ref(isWx);
const store = useStore();

const bodyHeight = ref(document.querySelector("body")?.clientHeight || 1000);
const autoHeight = computed(() => {
  let p = 722;
  return `${bodyHeight.value - p}px`;
});

const isBpmUser = ref(false) // 用来判断是否展示新的bpm
const BpmUri = GetBpm()

const entranceVisible = ref(false);
const entrance = ref([1,2,3,4,5,7,9,10,13,12]);

const getEntranceDatas = () => {
  GetMyEntrance().then(res => {
    if (res.isOk&&res.data&&res.data.uses) {
      entrance.value = JSON.parse(res.data.uses)
    } 
  })
};


const updateEntrance = (value) => {
  entrance.value = value;
}

const special = ref([
  {
    id: "1",
    label: "鑫服务",
    image: Image3,
    path: "https://oa.xinyuanfuwu.com/sys/portal/page.jsp?pageId=18518ce4034be65ef710e71434c8ab2d",
    style: {},
  },
  {
    id: "2",
    label: "鑫文化",
    image: Image2,
    path: "https://oa.xinyuanfuwu.com/sys/portal/page.jsp?pageId=18518ce4031267f4f11f4a6456bb72e2",
    style: {},
  },
  {
    id: "3",
    label: "鑫榜样",
    image: Image1,
    path: "https://oa.xinyuanfuwu.com/sys/portal/page.jsp?pageId=18518ce4033c3c86f7b8b754b83bd315",
    style: {},
  },
  {
    id: "4",
    label: "鑫党建",
    image: Image4,
    path: "https://oa.xinyuanfuwu.com/sys/portal/page.jsp?pageId=18518ce4024b0e27a7ca9da414a88827",
    style: {},
  },
]);
const specialHandle = (cur) => {
  const { path } = cur;
  if (!path) return;
  const a = document.createElement("a");
  a.target = "_black";
  a.href = path;
  a.rel = "noreferrer";
  a.click();
};
const informActive = ref("1979f783088eaecc4510ea84156ae689");
const informTabs = ref([
  {
    name: "1979f783088eaecc4510ea84156ae689",
    label: "集团公告",
  },
  {
    name: "18210aa5f3535dc9e5576834901b156b",
    label: "物管公告",
  },
  // {
  //   name: "18210aa5f3535dc9e5576834901b156b",
  //   label: "分子公司公告",
  // },
  {
      name: '193288d6592e65d73e1797a4896aa0fd',
      label: '商管公告'
  },
  {
      name: '19424d851d40d919354ba3c4d23a22d0',
      label: '科经公告'
  },
  // {
  //     name: '193288d4cb9c37e5e4c7ad14ae3a9b7a',
  //     label: '科技公告'
  // }
]);
const informDatas = ref([]);
const informLoading = ref(false);
const getInformData = () => {
  informLoading.value = true;
  GetNewsDatas({
    cateid: informActive.value,
    rowsize: 20,
  })
    .then((res) => {
      const datas = JspData(res);
      informDatas.value = datas;
    })
    .finally(() => {
      informLoading.value = false;
    });
};
const informMoreClickHandle = () => {
  const categoryId = "1979f783088eaecc4510ea84156ae689";
  specialHandle({
    path: `https://oa.xinyuanfuwu.com/sys/news/?categoryId=${categoryId}&s_css=default#j_path=/docCategory&cri.q=fdDepartment:${informActive.value}`,
  });
};
const informTabChangeHandle = () => {
  informDatas.value = [];
  getInformData();
};

const newsActive = ref("18210ee676299b0ddbc3c93440e8bc47");
const newsTabs = ref([
  {
    name: "18210ee676299b0ddbc3c93440e8bc47",
    label: "官微",
  },
  {
    name: "18210ee991cf5cfacf4ac9446aeabef6",
    label: "IR",
  },
]);
const newsDatas = ref([]);
const newsLoading = ref(false);
const newsTabChangeHandle = () => {
  newsDatas.value = [];
  getNewsData();
};
const getNewsData = () => {
  newsLoading.value = true;
  GetNewsDatas({
    cateid: newsActive.value,
    rowsize: 20,
  })
    .then((res) => {
      const datas = JspData(res);
      newsDatas.value = datas;
    })
    .finally(() => {
      newsLoading.value = false;
    });
};

const newsClickHandle = (data) => {
  const { id } = data;
  specialHandle({
    path: `https://oa.xinyuanfuwu.com/sys/news/sys_news_main/sysNewsMain.do?method=view&fdId=${id}`,
  });
};

const moreClickHandle = (categoryId) => {
  specialHandle({
    path: `https://oa.xinyuanfuwu.com/sys/news/?categoryId=${categoryId}`,
  });
};

const matterActive = ref("todo");
const matterApi = {
  todo: GetDoneData,
  toview: GetUnreadData,
  kmReview: GetMyData,
  tododone: GetFinishData
}
const matterTabs = ref([
  {
    name: "todo",
    label: "待办",
    morePath: "https://oa.xinyuanfuwu.com/sys/notify/index.jsp#j_path=/process&dataType=todo",
    bpmMorePath: `${BpmUri}/xinbpm/todo`,
    notifyKey: "type_1",
    params: {
      dataType: "todo",
    }
  },
  {
    name: "toview",
    label: "待阅",
    morePath: "https://oa.xinyuanfuwu.com/sys/notify/index.jsp#j_path=/read&dataType=toview",
    bpmMorePath: `${BpmUri}/xinbpm/receive`,
    notifyKey: "type_2",
    params: {
      status: 1,
      dataType: "toview",
      fdType: 2,
      "q.dataType": "toview",
      "q.j_path": "/read",
    }
  },
  {
    name: "kmReview",
    label: "发起",
    morePath:"https://oa.xinyuanfuwu.com/km/review/#j_path=/listCreate&mydoc=create",
    bpmMorePath: `${BpmUri}/bpm/my/applyList`,
    params: {
      dataType: "kmReview",
    }
  },
  {
    name: "tododone",
    label: "已办",
    morePath: "https://oa.xinyuanfuwu.com/sys/notify/index.jsp#j_path=/process&dataType=tododone",
    bpmMorePath: `${BpmUri}/xinbpm/approve`,
    params: {
      dataType: "tododone",
    }
  },
]);
const matterDatas = reactive({
  todo: [],
  toview: [],
  kmReview: [],
  tododone: [],
});
const matterLoading = ref(false);
const getTodoData = async () => {
  matterDatas[matterActive.value] = [];
  if (!matterApi[matterActive.value]) return;
  matterLoading.value = true;
  if (matterActive.value==='kmReview') {
    await cmsApi.applyTaskList().then((res) => {
      const b = res.data.rows.map((item) => {
        return {
          id: item.id,
          title: item.title,
          time: item.createTime.slice(0, 10),
          source: 'BPM',
          trHref: `/bpm/bpm/instanceDetail?id=${item.id}&type=instIdStart&backR=BpmMyApplyList`,
          creator: item.creator,
          statusDesc: item.statusDesc==='运行中'?'审批中':item.statusDesc,
          approver: item.pendingApprovalTasks?.map(item => item.assignNames.replace(/\[用户\]/g,'')).join(','),
        };
      });
      matterDatas[matterActive.value] = [...b, ...matterDatas[matterActive.value]];
      // matterDatas[matterActive.value].sort((a, b) => {
      //   return new Date(b.time).getTime() - new Date(a.time).getTime();
      // });
    }).finally(() => {
      matterLoading.value = false;
    });
    // GetKmDatas().then((res) => {
    //   const a = ColumnsData(res?.datas || []);
    //   const b = a.map((item) => {
    //     return {
    //       id: item.fdId,
    //       title: item.docSubject,
    //       time: item.docCreateTime,
    //       source: 'LANLING',
    //       trHref: `https://oa.xinyuanfuwu.com/km/review/km_review_main/kmReviewMain.do?method=view&fdId=${item.fdId}`,
    //     };
    //   });
    //   matterDatas[matterActive.value] = [...b, ...matterDatas[matterActive.value]];
    //   matterDatas[matterActive.value].sort((a, b) => {
    //     return new Date(b.time).getTime() - new Date(a.time).getTime();
    //   });
    // }).finally(() => {
    //   matterLoading.value = false;
    // });
    return;
  }
  matterApi[matterActive.value]({
    currentPage: 1,
    pageSize: 100,
    queryParam: {
      
    }
  }).then(res => {
    if (res.isOk&&res.data) {
      const { rows } = res.data;
      if (matterActive.value==='todo') {
        notifyInfo.value["type_1"] = Number(res.data.total);
        if (notifyInfo.value["type_1"] > 99) notifyInfo.value["type_1"] = `99+`;
      }
      if (matterActive.value==='toview') {
        notifyInfo.value["type_2"] = Number(res.data.total);
        if (notifyInfo.value["type_2"] > 99) notifyInfo.value["type_2"] = `99+`;
      }
      if (rows) {
        rows.forEach((item) => {
          if (matterActive.value==='todo'&&item.createTime) item.time = item.createTime.slice(0, 10);
          if (item.trHref&&item.trHref.indexOf('/thirdPartyAuthentication/redirectMsg')>-1) {
            item.trHref = `http://oa.xinyuanfuwu.com/sys/notify/sys_notify_todo/sysNotifyTodo.do?method=view&fdId=${item.id}`
          }
        });
      }
      matterDatas[matterActive.value] = rows||[];
    }
  }).finally(() => {
    matterLoading.value = false;
  });
};
const matterTabChangeHandle = () => {
  getNotifyData();
  getTodoData();
};
const matterMoreHandle = () => {
  const cur = matterTabs.value.find((item) => item.name === matterActive.value);
  if (!cur) return;
  const { morePath, bpmMorePath } = cur;
  if (!morePath&&!bpmMorePath) return;
  if (isBpmUser.value) {
    window.open(`${bpmMorePath}`, '_blank');
    return;
  }
  specialHandle({
    path: morePath,
  });
};
const matterClickHandle = async (data) => {
  const {source, trHref} = data;
  let link
  if (matterActive.value==='toview') {
    const Api = source==='BPM'?BPMReadData:ReadData
    await Api({id: data.id})
  }
  switch (source) {
    case 'BPM':
      link = `${BpmUri}${trHref.replace('/bpm/bpm/','/xinbpm/')}`
      break;
    case 'LANLING':
      link = trHref.indexOf("http")>-1 ? trHref:`https://oa.xinyuanfuwu.com/${trHref}`
      break;
  }
  specialHandle({
    path: link
  });
};
const notifyInfo = ref({
  type_1: 0,
  type_2: 0
});
const getNotifyData = () => {
  if (matterActive.value!=='todo') matterApi['todo']({
    currentPage: 1,
    pageSize: 100,
    queryParam: {
      
    }
  }).then(res => {
    if (res.isOk&&res.data) {
      notifyInfo.value["type_1"] = Number(res.data.total);
      if (notifyInfo.value["type_1"] > 99) notifyInfo.value["type_1"] = `99+`;
    }
  })
  if (matterActive.value!=='toview') matterApi['toview']({
    currentPage: 1,
    pageSize: 100,
    queryParam: {
      
    }
  }).then(res => {
    if (res.isOk&&res.data) {
      notifyInfo.value["type_2"] = Number(res.data.total);
      if (notifyInfo.value["type_2"] > 99) notifyInfo.value["type_2"] = `99+`;
    }
  })
};

const classifyInput = ref("");
const classifyActive = ref([]);
const classifyDatas = ref([
  {
    id: '1-1',
    title: '流程首页',
    path: '/homepage',
    icon: 'xinbpm-icon-',
  },
  {
    id: '1-2',
    title: '全部流程',
    path: '/listAll',
    icon: 'xinbpm-icon-',
  },
  {
    id: '1-3',
    title: '发起流程',
    path: '/create',
    icon: 'xinbpm-icon-',
  },
  {
    id: '1-8',
    title: '流程概览',
    path: '/overview',
    icon: 'xinbpm-icon-',
  },
  {
    id: '1-4',
    title: '流程审核',
    path: '/listExamine',
    icon: 'xinbpm-icon-',
  },
  {
    id: '1-5',
    title: '流程跟踪',
    path: '/listFollow',
    icon: 'xinbpm-icon-',
  },
  {
    id: '1-6',
    title: '流程反馈',
    path: '/listFeedback',
    icon: 'xinbpm-icon-',
  },
  {
    id: '1-7',
    title: '流程查询',
    path: '/search',
    icon: 'xinbpm-icon-',
  },
  {
    id: '2-1',
    title: '归档箱',
    path: '/listFiling',
    icon: 'xinbpm-icon-',
  },
  {
    id: '2-2',
    title: '废弃箱',
    path: '/listDiscard',
    icon: 'xinbpm-icon-',
  }
]);

const bpmClassify = ref([
  {
    id: '2-1',
    title: '流程发起',
    path: '/bpm/my/definitionList',
    icon: 'xinbpm-icon-icon3',
  },
  {
    id: '2-2',
    title: '流程草稿',
    path: '/bpm/my/draftList',
    icon: 'xinbpm-icon-icon15',
  },
  {
    id: '2-3',
    title: '流程待办',
    path: '/xinbpm/todo',
    icon: 'xinbpm-icon-icon16',
  },
  {
    id: '2-4',
    title: '流程已办',
    path: '/xinbpm/approve',
    icon: 'xinbpm-icon-icon17',
  },
  {
    id: '2-5',
    title: '流程待阅',
    path: '/xinbpm/receive',
    icon: 'xinbpm-icon-icon18',
  },
  {
    id: '2-6',
    title: '流程已阅',
    path: '/xinbpm/read',
    icon: 'xinbpm-icon-icon22',
  },
  {
    id: '2-7',
    title: '我的发起',
    path: '/bpm/my/applyList',
    icon: 'xinbpm-icon-icon21',
  },
  // {
  //   id: '2-8',
  //   title: '流程代理',
  //   path: '/bpm/my/agentList',
  //   icon: 'xinbpm-icon-icon20',
  // },
  {
    id: '2-9',
    title: '全部流程',
    path: '/xinbpm/all',
    icon: 'xinbpm-icon-icon23',
  }
])

const flowIconColorList = [
  [
    "#eb2f96",
    "#f5222d",
    "#52c41a",
    "#fa8c16",
    "#f759ab",
    "#9254de",
    "#2f54eb",
    "#722ed1",
  ], //绚丽多彩
  [
    "#F25252",
    "#578AF2",
    "#62E075",
    "#42B36F",
    "#FFD660",
    "#B3DE36",
    "#FA914E",
    "#F25252",
  ], //绚丽多彩
  [
    "#7172AD",
    "#509EE3",
    "#9CC177",
    "#A989C5",
    "#F9D45C",
    "#F1B556",
    "#A6E7F3",
    "#7172AD",
  ], //默认色彩组合
  [
    "#006BC2",
    "#4D8CAE",
    "#AD5601",
    "#324498",
    "#2B5B75",
    "#0FA8E0",
    "#FF8500",
    "#006BC2",
  ], //清新草绿
  [
    "#F06B36",
    "#B3DE36",
    "#5EC663",
    "#4598F0",
    "#13BBAD",
    "#E26735",
    "#F25252",
    "#FA914E",
  ], //第一选择
  [
    "#FBE8E1",
    "#FF9090",
    "#D53872",
    "#B91515",
    "#BBA588",
    "#FFD54F",
    "#FF9800",
    "#FBE8E1",
  ], //热情暖阳
  [
    "#984337",
    "#DB5545",
    "#784029",
    "#E39970",
    "#E0D09F",
    "#A5A187",
    "#474844",
    "#984337",
  ], //英伦酒红
  [
    "#B7D62E",
    "#8AC98B",
    "#A4DED9",
    "#67B9CD",
    "#D6D6D7",
    "#8D9E69",
    "#EB4B5C",
    "#B7D62E",
  ], //蓝橙撞色
  [
    "#7260AF",
    "#C366A1",
    "#503491",
    "#DAA6D6",
    "#A999C9",
    "#D3C3DB",
    "#A563AC",
    "#7260AF",
  ], //神秘魅紫
];
const info = reactive({
  //流程定义Map，key：分类名称，value：流程定义列表
  definitionMap: {},
  //搜索结果
  serachMap: {},
  selectVal: "",
  loading: false,
  flowIconColorList: flowIconColorList,
  timer: null,
});
const classifyClickHandle = (data) => {
  const { path } = data;
  if (isBpmUser.value) {
    window.open(`${BpmUri}${path}`, '_blank');
    return;
  }
  specialHandle({
    path: `https://oa.xinyuanfuwu.com/km/review/index.jsp#j_path=${path}`,
  });
};
const searchFn = (name) => {
  if (info.timer) {
    clearTimeout(info.timer);
  }

  if (!name) {
    info.serachMap = info.definitionMap;
    return;
  }

  info.timer = setTimeout(() => {
    const result = {};
    for (const key in info.definitionMap) {
      const values = info.definitionMap[key];
      if (values && values.length > 0) {
        const valuesTemp: any = [];
        for (let i = 0; i < values.length; i++) {
          if (values[i].name.includes(name)) {
            valuesTemp.push(values[i]);
          }
        }
        if (valuesTemp.length > 0) {
          result[key] = valuesTemp;
        }
      }
    }
    info.serachMap = result;
  }, 800);
};

//请求常用流程列表
const getData = async () => {
  const bpmRes = await cmsApi.bpmMydefinitionListUrl({});
  const definitList = bpmRes.data;
  // if (!definitList || definitList.length === 0) {
  //   isBpmUser.value = false;
  //   return;
  // }
  isBpmUser.value = true;
  const typeList: any = await cmsApi.getDictListByCode("flowType");
  if (!typeList || !typeList.length || typeList.length === 0) {
    info.definitionMap["未知分类"] = definitList;
    info.serachMap = info.definitionMap;
    return;
  }

  //对 bpmDefinitions 按typeCode 进行分组,找出没有分类的流程 放到未知分类中
  const noTypeDefinitions = [] as any[];
  const bpmDefinitionMap = {} as any;
  definitList.forEach((bpmItem: any) => {
    const node: any = typeList.find((item: any) => {
      return item.code === bpmItem.typeCode;
    });
    if (!bpmItem.typeCode || !node) {
      noTypeDefinitions.push(bpmItem);
    } else {
      if (!bpmDefinitionMap[bpmItem.typeCode]) {
        bpmDefinitionMap[bpmItem.typeCode] = [] as any[];
      }
      bpmDefinitionMap[bpmItem.typeCode].push(bpmItem);
    }
  });
  //对流程进行分组
  const resultCode = {} as any;
  const resultMap = {} as any;
  typeList.forEach((dictNode: any) => {
    const definitions = bpmDefinitionMap[dictNode.code];
    if (definitions && definitions.length > 0) {
      if (Object.keys(resultCode).includes(dictNode.code)) {
        definitions.forEach((item: any) => {
          resultMap[resultCode[dictNode.code]].push(item);
        });
      } else {
        resultCode[dictNode.code] = dictNode.name;
        resultMap[dictNode.name] = definitions;
      }
    }
  });

  if (noTypeDefinitions.length > 0) {
    resultMap["未知分类"] = noTypeDefinitions;
  }

  info.definitionMap = resultMap;
  info.serachMap = info.definitionMap;
};

const goBpm = (def) => {
  window.open(`${BpmUri}/onlyFlowStart/${def.key}`);
};

const mineEditHandle = () => {
  return;
  router.push(`/login`);
};
const closePage = () => {
  proxy.$ww.closeWindow()
}

const banerDatas = ref([]);
const getBannerData = () => {
  banerDatas.value = [];
  GetBannerData().then((res) => {
    banerDatas.value = res?.data?.list.sort((a, b) => {
      return a.sort_ - b.sort_;
    }).map((item) => {
      const { bg_img_, text_img_ } = item;
      const bgImg = JSON.parse(bg_img_)[0]?.id ||'';
      const textImg = JSON.parse(text_img_)[0]?.id ||'';
      return {
        ...item,
        bgImg: `${BpmUri}/api/ab-bpm/sys/sysFile/view/${bgImg}`,
        textImg: textImg ? `${BpmUri}/api/ab-bpm/sys/sysFile/view/${textImg}` : ''
      };
    })
  })
}
const getDatas = async () => {
  try {
    // banner
    await getBannerData();
    // 快捷入口
    await getEntranceDatas();
    // 待办
    await getTodoData();
    // 公告
    await getInformData();
    // 资讯 
    await getNewsData();
    // 消息数
    await getNotifyData();
    // 流程中心
    await getData().then(() => {
      if (isWeChat.value) {
        let hasToken = encodeURIComponent(store.getters['user/accessToken'])
        let oaToken = encodeURIComponent(store.getters['user/oaToken'])
        proxy.$ww.openDefaultBrowser({
          url: `${import.meta.env?.VITE_REDIRECT_URI}?accessToken=${hasToken}&oaToken=${oaToken}`,
          success: () => {
            closePage()
          },
          fail: (err) => {
            console.error('打开浏览器失败:', err)
          }
        });
      }
    });
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const handleVisiable = () => {
  if (document.visibilityState === 'hidden') {
    // 隐藏时的操作
    console.log('页面被隐藏了')
  } else {
    console.log('页面被显示了')
    matterTabChangeHandle();
  }
};

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisiable);
});
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", handleVisiable);
});

getDatas();
</script>

<style lang="scss" scoped>
.workbench-view {
  padding: 10px 10px 0 10px;
  height: calc(100vh - 90px);
  display: flex;
  // flex-direction: column;
  font-size: 12px;
  & > div {
    height: 100%;
  }
  .workbench-view-l {
    width: 230px;
    display: flex;
    flex-direction: column;
  }
  .workbench-view-r {
    flex: 1;
    display: flex;
    flex-direction: column;
    & > div {
      display: flex;
      & + div {
        margin-top: 10px;
      }
    }
  }
  .view-l {
    flex: 1.51;
  }
  .view-r {
    flex: 1;
    // width: 35%;
    // min-width: 460px;
    // max-width: 530px;
  }
  &-top {
    // flex: 2;
  }
  &-con {
    flex: 1;
  }
  &-bom {
    flex: 1;
  }

  .top1 {
    display: none;
  }
  .workbench-card {
    background-color: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ebedf0;
  }
  .workbench-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #eef1f5;
    padding: 9px 20px;
    border-bottom: 1px solid #e7e7e7;
    .more {
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;
      color: $base-color-primary;
      display: flex;
      align-items: center;
      line-height: 12px;
    }
  }
  .workbench-interval-bom {
    margin-bottom: 10px;
  }
  .workbench-interval-right {
    margin-right: 10px;
  }
  .workbench-view-top {
    display: flex;
  }
  .top-l {
    width: 300px;
    display: flex;
    flex-direction: column;
    .top-l-scrollbar {
      flex: 1;
    }
  }
  .top-r {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 315px);
  }
  .workbench-user {
    height: 152px;
    border-bottom: 1px solid #0000001a;
    display: flex;
    position: relative;
    padding-top: 10px;
    .user-edit {
      position: absolute;
      right: 0;
      top: 0;
      background-color: #3380ff1a;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $base-color-primary;
      font-size: 14px;
      cursor: pointer;
    }
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
      flex: 1;
      min-width: 0px;
      padding-left: 20px;
      color: #302e6d;
      font-size: 12px;
      line-height: 22px;
      & > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .user-info-name {
        display: flex;
        align-items: center;
        font-size: 20px;
        color: #333;
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
        color: $base-color-primary;
        padding: 20px 0 10px 0;
        & > span {
          background-color: #3380ff1a;
          border-radius: 20px;
          padding: 5px 10px;
        }
      }
    }
  }
  .flow-title {
    padding: 0 0 20px 0;
  }
  .classify-input {
    width: calc(100% - 40px);
    line-height: 24px;
    margin: 14px 20px;
  }
  .entrance-lis {
    display: flex;
    // justify-content: space-around;
    flex-flow: wrap;
    flex: 1;
    padding: 15px 0;
    .entrance-li {
      width: 50%;
    }
  }
  .news-scrollbar > div.special-lis {
    padding: 10px;
  }
  .special-lis {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .special-li {
      width: 50%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 10px;
      position: relative;
      cursor: pointer;
      .special-icon {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        &:after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: #0000004d;
        }
        .el-image {
          height: 100%;
          width: 100%;
        }
      }
      .special-label {
        line-height: 20px;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
      }
      &:hover {
        color: $base-color-primary;
      }
    }
  }
  .height-10 {
    height: 10px;
  }
  .news-scrollbar {
    flex: 1;
    position: relative;
    & > div {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 0 20px 15px 20px;
    }
  }
  .inform-scrollbar {
    height: 160px;
  }
  .workbench-news-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  .news-li {
    display: flex;
    align-items: center;
    height: 28px;
    color: #333;
    font-size: 12px;
    cursor: pointer;
    .news-content {
      flex: 1;
      display: flex;
      align-items: center;
      min-width: 0px;
      padding-right: 30px;
      .news-c-text {
        flex: 1;
        width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        & > div {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      :deep(.el-tag--small) {
        font-size: 10px;
        height: 18px;
        padding: 0 4px
      }
    }
    .news-time {
      color: #666;
    }
    .news-tag {
      background-color: #ff414b;
      color: #fff;
      font-size: 10px;
      padding: 2px 3px;
      margin-right: 10px;
    }
    .news-point {
      display: inline-block;
      width: 5px;
      height: 5px;
      background-color: #333;
      border-radius: 50%;
      margin: 0 10px;
    }
    &:hover {
      color: $base-color-primary;
      // .news-point {
      //     background-color: $base-color-primary;
      // }
    }
  }
  .approver-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 5px;
  }
  .classify-item {
    color: #000000cc;
    .classify-item-title {
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 28px;
      font-weight: 500;
      padding: 0 10px;
      border-radius: 6px;
      width: 100%;
      color: #000000cc;
      font-size: 14px;
      .classify-item-label {
        flex: 1;
        display: flex;
        min-width: 0px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .classify-item-menu-icon {
        margin-right: 20px;
        display: flex;
        align-items: center;
      }
      .classify-item-arrow-icon {
        font-size: 12px;
        transition: all 0.4s;
        display: flex;
        align-items: center;
      }
    }
    &.is-active {
      .classify-item-title {
        background-color: #eef5ff;
        color: $base-color-primary;
        .classify-item-arrow-icon {
          color: $base-color-primary;
          transform: rotate(180deg);
        }
      }
    }
  }
  .workbench-card-classify-item-lis-max-h {
    max-height: 320px;
  }
  .classify-item-lis {
    flex: 1;
    font-size: 12px;
    color: #000000cc;
    padding: 10px;
    cursor: pointer;
    & > div {
      display: flex;
      align-items: center;
      height: 34px;
      width: 100%;
      padding-left: 25px;
      .img-icon-active {
        display: none;
      }
      .content {
        flex: 1;
        min-width: 0px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .point {
        display: inline-block;
        width: 5px;
        height: 5px;
        background-color: #000000cc;
        border-radius: 50%;
        margin: 0 10px;
      }
      .classify-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        & > span {
          font-size: 12px;
        }
      }
      &:hover {
        color: $base-color-primary;
        background: #eef5ff;
        .point {
          background-color: $base-color-primary;
        }
        .img-icon {
          display: none;
        }
        .img-icon-active {
          display: inline-block;
        }
      }
    }
    &.classify-item-lis-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      & > div {
        width: 89px;
        border: 1px solid #EEF1F5;
        padding-left: 5px;
      }
    }
  }
  .classify-item + .classify-item {
    margin-top: 10px;
  }
  .matter-tabs {
  }
  .matter-tabs-sub {
    font-size: 12px;
    font-weight: 400;
    color: #878787;
    margin-left: 5px;
    // margin-top: 4px;
    width: 15px;
  }
  .workbench-tabs-view {
    position: relative;
    .workbench-title {
      position: absolute;
      top: 5px;
      right: 0px;
      z-index: 1;
      border-bottom-width: 0;
    }
  }
  .workbench-todo-view {
    background: url("./images/bg.svg") no-repeat bottom center;
    background-size: 100% auto;
    background-color: #fff;
  }
  .xinpm-img-view {
    overflow: hidden;
    position: relative;
    height: 14vh;
    cursor: pointer;
    .workbench-view-carousel {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    .xinpm-img {
      width: 100%;
      height: 100%;
    }
    .xinpm-img-text {
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      & > img {
        height: 100%;
      }
    }
  }
  .ban3-t {
    width: 90%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 2%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    & > img {
      height: 80%;
    }
  }
  .workbench-card-flow {
    flex: 1;
    position: relative;
    .workbench-card-flow-scrollbar {
      position: absolute;
      top: 98px;
      left: 0;
      width: 100%;
      height: calc(100% - 98px);
    }
  }
  .workbench-card-entrance {
    flex: 1.5;
    &.workbench-card-entrance-fix {
      flex: none;
      height: 473px;
    }
  }
}
</style>

<style lang="scss">
.workbench-view {
  background-color: #f7f9ff;
  .flow-title {
    .classify-input .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
  .matter-tabs {
    --el-tabs-header-height: 38px;
    --el-border-color-light: #e7e7e7;
    .el-tabs__header {
      background: #eef1f5;
      padding: 0 20px;
      border-bottom: 1px solid #e7e7e7;
    }
    .el-tabs__nav-wrap:after {
      height: 1px;
    }
    .el-tabs__item {
      font-size: 16px;
      font-weight: 600;
    }
  }
  .el-collapse {
    border-top: none;
  }
  .classify-item {
    .el-collapse-item__header {
      height: 28px;
      line-height: 28px;
    }
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
    .el-collapse-item__arrow {
      display: none;
    }
    .el-collapse-item__header,
    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }
  .lui_notify_done_flag {
    border-radius: 2px;
    font-size: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: #4cbe45;
    color: #4cbe45;
    padding: 0px 2px;
  }
  .workbench-view-carousel {
    .el-carousel__container {
      height: 100%;
    }
  }
}
.workbench-view2 {
  display: none !important;
}
</style>

<style lang="scss" scoped>
@media screen and (max-height: 800px) {
  .workbench-view {
    font-size: 12px;
    .workbench-title {
      font-size: 14px;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .workbench-card {
    }
    .entrance-lis {
      padding: 10px 0;
      .entrance-li {
        .entrance-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          & > img {
            height: 15px;
          }
        }
        &.rent-view {
          .entrance-icon {
            & > img {
              width: 34px;
              height: 34px;
            }
          }
        }
      }
    }
    .news-li {
      font-size: 12px;
      height: 28px;
      .news-tag {
        font-size: 10px;
      }
    }
    .matter-tabs-sub {
      font-size: 12px;
    }
    .special-lis {
      .special-li {
        .special-icon {
        }
        .special-label {
        }
      }
    }
    .flow-title {
      padding-bottom: 10px;
    }
    .classify-item-lis {
      font-size: 12px;
      & > div {
        padding-left: 0px;
        height: 24px;
      }
    }
    .workbench-card-flow {
    }
    .height-10 {
      height: 5px;
    }
    --el-font-size-base: 13px;
    .el-tabs {
      --el-tabs-header-height: 28px;
    }
    .workbench-tabs-view {
      .workbench-title {
        top: 4px;
      }
    }
  }
}
</style>

<style lang="scss">
@media screen and (max-height: 800px) {
  .workbench-view {
    .el-tabs__item {
      padding: 0 10px;
    }
    .matter-tabs {
      .el-tabs__item {
        font-size: 14px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .workbench-view2 {
    display: block !important;
    height: auto !important;
    padding: 0 !important;
  }
  .workbench-view {
    flex-direction: column;
    height: auto !important;
    .top1 {
      display: block;
    }

    .top2 {
      display: none !important;
    }

    .workbench-view-l {
      width: 100% !important;
    }

    .workbench-interval-right {
      margin-right: 0 !important;
    }

    .classify-item-lis {
      display: flex !important;
      flex-wrap: wrap;

      & > div {
        flex: 1;
        min-width: 50% !important;
      }
    }

    .workbench-view-con {
      flex-direction: column;
    }

    .workbench-view-bom {
      flex-direction: column;
    }
  }
  .workbench-view .news-scrollbar > div {
    position: static !important;
  }
  .workbench-view .entrance-lis .entrance-li {
    width: 20% !important;
    min-width: 64px;
    margin-bottom: 10px;

    align-content: flex-start;
  }
}

@media screen and (max-width: 1200px) {
  .workbench-view {
    height: auto !important;

    .workbench-view-con {
      flex-direction: column;
    }

    .workbench-view-bom {
      flex-direction: column;
    }
  }
  .workbench-view .news-scrollbar > div {
    position: static !important;
  }
  .workbench-card-flow {
    height: 260px;
    flex: none !important;
  }
}

@media screen and (min-width: 1200px) {
  .workbench-view {
    .workbench-card-flow {
      // max-height: calc(100vh - 436px - 56px - 81px);
    }
  }
}
</style>
<style>
.lui_notify_content_1,
.lui_notify_content_2 {
  padding: 0 !important;
}
</style>
