<template>
    <div class="task-mobile-view">
        <div class="task-mobile-view-header">
            <van-tabs v-model:active="tabActive" @change="tabChangeHandle">
                <van-tab v-for="x in tabsData" :title="x.title" :name="x.name">
                    <template #title>
                        <div class="tab-title">{{ x.title }} <span class="num" v-if="dataNums[x.name]!==undefined&&dataNums[x.name]>0">{{ dataNums[x.name]>99?'99+':dataNums[x.name] }}</span></div>
                    </template>
                </van-tab>
            </van-tabs>
            <div class="header-search" @click="searchHandler">
                <van-icon name="search" />
            </div>
        </div>
        <div class="list-scroll">
            <van-pull-refresh class="task-view-pull-refresh" :head-height="100" v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad">
                    <div class="task-item" v-for="x in list" :key="x.id" v-show="!x.isHide" @click="taskClickHandle(x)">
                        <div class="task-title" >
                            <template v-if="x.appName">【{{ x.appName }}】</template>
                            <span v-html="x.title"></span>
                        </div>
                        <div class="task-sub">
                            <span v-if="x.creatorName">{{ x.creatorName }}</span>
                            <span class="sub-time">{{ x.createTime }}</span>
                            <span v-if="x.appName">{{ x.appName }}</span>
                        </div>
                        <div v-if="tabActive==='b'" class="task-btns">
                            <van-button type="primary" size="mini" @click.stop="readDataHandle(x)">置为已阅</van-button>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GetDoneData, GetFinishData, GetUnreadData, GetReadData, ReadData, BPMReadData } from '@/api/xinbpm';
import { GetBpm, specialHandle } from '@/utils/index'
import { showConfirmDialog, showSuccessToast } from 'vant';
import { useRoute } from "vue-router";
import 'vant/es/dialog/style';
import 'vant/es/toast/style';

import router from "@/router";
const route = useRoute();
const routeQuery = route.query;

const BpmUri = GetBpm()

const tabActive = ref(routeQuery.tab||localStorage.getItem('taskTabActive')||'a');
const apiEvents = {
    a: GetDoneData,
    b: GetUnreadData,
    c: GetFinishData,
    d: GetReadData
};
const tabsData = [
    {
        title: '待办',
        name: 'a'
    },
    {
        title: '待阅',
        name: 'b'
    },
    {
        title: '已办',
        name: 'c'
    },
    {
        title: '已阅',
        name: 'd'
    }
];

const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const params = {
    current: 0,
    size: 20
}
const filterParams = ref({
    name: ''
})
const dataNums = ref({
    a: 0,
    b: 0
})
const onLoad = () => {
    // 异步更新数据
    if (refreshing.value) {
        list.value = [];
        refreshing.value = false;
    }
    const Api = apiEvents[tabActive.value]
    if (!Api) {
        finished.value = true;
        return;
    }
    loading.value = true;
    params.current++;
    const titleKey = tabActive.value==='b'||tabActive.value==='d'?'b.title$VLK':'title$VLK';
    Api({
        currentPage: params.current,
        pageSize: params.size,
        queryParam: {
            [titleKey]: filterParams.value.name
        }
    }).then((res) => {
        // console.log(res)
        const { data } = res;
        if (data.rows) {
            data.rows.forEach((item, index) => {
                if (tabActive.value==='b') {
                    item.isHide = false;
                }
                if (item.trHref.indexOf('/approve/flow.html')>-1) {
                    item.trHref = item.trHref.replace('platform-app/flow/runtime/approve/flow.html', 'platform-app/mobile/approve/approve_detail.html')
                }
                if (item.trHref.indexOf('/thirdPartyAuthentication/redirectMsg')>-1) {
                    item.trHref = `http://oa.xinyuanfuwu.com/sys/notify/sys_notify_todo/sysNotifyTodo.do?method=view&fdId=${item.id}`
                }
            })
        }
        list.value.push(...data.rows);

        // 数据全部加载完成
        if (list.value.length >= data.total) {
            finished.value = true;
        }
    }).finally(() => {
        // 加载状态结束
        loading.value = false;
    }).catch((err) => {
        finished.value = true;
    })
};
const onRefresh = () => {
    // 清空列表数据
    finished.value = false;
    refreshing.value = true;
    params.current = 0;
    onLoad();
};

const tabChangeHandle = () => {
    localStorage.setItem("taskTabActive", tabActive.value)
    onRefresh()
};

const taskClickHandle = async (info) => {
    const {source, trHref} = info;
    let link
    if (tabActive.value==='b') {
        const Api = source==='BPM'?BPMReadData:ReadData
        await Api({
            id: info.id
        }).then(() => {
            dataNums.value['b'] = dataNums.value['b']-1;
            info.isHide = true;
        })
    }
    switch (source) {
      case 'BPM':
        link = `${BpmUri}/app${trHref}`
        break;
      case 'LANLING':
        link = trHref.indexOf("http")>-1 ? trHref:`https://oa.xinyuanfuwu.com/${trHref}`
        break;
    }
    specialHandle({
        path: link
    })
};

const readDataHandle = (info) => {
    const { source } = info;
    const Api = source==='BPM'?BPMReadData:ReadData
    showConfirmDialog({
        title: '操作提示',
        message: '当前数据将置为已阅，是否确认?',
    })
    .then(() => {
        // on confirm
        Api({
            id: info.id
        }).then(() => {
            showSuccessToast('操作成功');
            dataNums.value['b'] = dataNums.value['b']-1;
            info.isHide = true;
        })
    })
    .catch(() => {
        // on cancel
    });
};

const getDatas = () => {
    for (var i in dataNums.value) {
        dataNums.value[i] = 0; 
    }
    GetDoneData().then((res) => {
        dataNums.value['a'] = res?.data?.total||0
    })
    GetUnreadData().then((res) => {
        dataNums.value['b'] = res?.data?.total||0
    })
}

const searchHandler = () => {
    router.push(`/search`)
};

</script>

<style lang="scss" scoped>
.task-mobile-view {
    height: 100vh;
    background-color: #EEF1FC;
    font-size: 16px;
    color: $base-color-3;
    .list-scroll {
        .van-list {
            height: calc(100vh - 45px);
            overflow-y: scroll;
            padding-left: 10px;
        }
    }
    .task-item {
        padding: 10px;
        background-color: #fff;
        border-radius: 8px;
        margin-top: 8px;
        .task-title {
            line-height: 20px;
        }
        .task-sub {
            font-size: 14px;
            color: $base-color-9;
            margin-top: 10px;
            .sub-time {
                margin: 0 10px;
            }
        }
        .task-btns {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
    }
    .tab-title {
        position: relative;
        .num {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 15px;
            position: absolute;
            right: -20px;
            top: -10px;
            font-size: 10px;
            color: #fff;
            background-color: $base-color-danger;
            border-radius: 8px;
            padding: 0 5px;
        }
    }
    .task-mobile-view-header {
        display: flex;
        align-items: center;
        background-color: #fff;
        .header-search {
            width: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
<style lang="scss">
.task-mobile-view {
    .van-tabs {
        .van-tabs__content {
            display: none;
        }
        .van-tab__text--ellipsis {
            overflow: visible;
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
        position: relative;
        top: -2px;
    }
    .task-view-pull-refresh {
        overflow: auto !important;
    }
    .task-mobile-view-header {
        .van-tabs {
            flex: 1;
        }
    }
}
</style>