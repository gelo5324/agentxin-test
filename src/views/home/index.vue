<template>
    <div class="home-view">
        <div class="home-view-linear"></div>
        <div class="home-view-t">
            <!-- https://oa.xinyuanfuwu.com/sys/notify/mobile/index.jsp -->
            <!-- specialHandle({path: `${BpmUri}/app/bpm/todoList`}) -->
            <div class="todo" @click="todo">
                <div>待办事宜</div>
                <div class="t-num">{{ notifyInfo.todoing||0 }}</div>
            </div>
            <!-- https://oa.xinyuanfuwu.com/km/review/mobile/index.jsp#path=1 -->
            <!-- specialHandle({path: `${BpmUri}/app/bpm/approveList`}) -->
            <div class="flow" @click="tomy">
                <div>我的流程</div>
                <div class="t-num">{{ notifyInfo.flow||0 }}</div>
            </div>
        </div>
        <template v-if="toolsAuth.length>0">
            <div class="height-10"></div>
            <div class="home-view-title">常用工具</div>
            <div class="home-tools">
                <template v-for="x in toolsData">
                    <div :key="x.id" v-if="toolVisible(x)" @click="toolClickHandle(x)">
                        <div class="tool-icon">
                            <img :src="x.icon" />
                        </div>
                        <div>{{ x.name }}</div>
                    </div>
                </template>
            </div>
        </template>
        <div class="height-20"></div>
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="x in bannerData" :key="x.id" @click="specialHandle(x)">
                <div class="banner-view">
                    <van-image :src="x.img" fit="cover" />
                </div>
            </van-swipe-item>
        </van-swipe>
        <div class="height-10"></div>
        <div class="news-tabs">
            <van-tabs :line-height="0" :background="'rgba(0,0,0,0)'" :swipeable="true" :shrink="true" v-model:active="informActive" @change="tabsChangeHandle">
                <van-tab v-for="x in informTabs" :key="x.name" :name="x.name">
                    <template #title>{{ x.label }}</template>
                </van-tab>
            </van-tabs>
            <span class="more-btn"  @click="informMoreClickHandle">查看更多</span>
        </div>
        <div class="home-news">
            <div v-for="x in newsData" :key="x.id"  @click="newsClickHandle(x)">
                <div class="news-title">{{ x.text }}</div>
                <div class="news-time">{{ x.created }}</div>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script setup>
import AppFooter from '@/layouts/components/Footer.vue'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import Tool1 from './images/tool1.svg'
import Tool2 from './images/tool2.svg'
import Tool3 from './images/tool3.svg'
import Tool4 from './images/tool4.svg'
import Tool5 from './images/tool5.svg'
import Tool6 from './images/tool6.svg'
import Tool7 from './images/tool7.svg'
import Tool8 from './images/tool8.svg'
import Tool9 from './images/tool9.svg'
import Tool10 from './images/tool10.svg'
import Tool11 from './images/tool11.svg'
import Banner1 from './images/banner1.jpg'
import Banner2 from './images/banner2.png'
import Banner3 from './images/banner3.jpg'
import Banner4 from './images/banner4.png'
import * as cmsApi from "@/api/innerMsg";
import { GetToolsData, GetPortletDatas, GetSSOUrl } from '@/api/home'
import { GetNewsDatas, GetNotify, GetFlowNum, GetMobileBusinessTravelUrl } from '@/api/workbench'
import { JspData, GetBpm } from '@/utils/index'
import { GetDoneData } from '@/api/xinbpm'
import { useRouter } from 'vue-router'
const router = useRouter()
const BpmUri = GetBpm()
const store = useStore()
const toolsAuth = ref([])
const toolsData = ref([
    {
        id: 1,
        name: '请假申请',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoQingjia.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool1,
        visible: () => {
            return toolsAuth.value.find(item => item===1)
        },
    },
    {
        id: 2,
        name: '出差申请',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoChuChai.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool2,
        visible: () => {
            return toolsAuth.value.find(item => item===2)
        }
    },
    {
        id: 3,
        name: '市内公出',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoGongChu.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool3,
        visible: () => {
            return toolsAuth.value.find(item => item===3)
        }
    },
    {
        id: 4,
        name: '未打卡说明',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoDaKa.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool4,
        visible: () => {
            return toolsAuth.value.find(item => item===4)
        }
    },
    {
        id: 9,
        name: '我的发起',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoFaQi.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool9,
        visible: () => {
            return toolsAuth.value.find(item => item===10)
        }
    },
    {
        id: 5,
        name: '我的信息',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoMyInfo.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool5,
        visible: () => {
            return toolsAuth.value.find(item => item===5)
        }
    },
    {
        id: 6,
        name: '我的资产',
        path: 'https://oa.xinyuanfuwu.com/km/asset/mobile',
        icon: Tool6,
        visible: () => {
            return toolsAuth.value.find(item => item===6)
        }
    },
    {
        id: 7,
        name: '我的票据',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoPiaoJu.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool7,
        visible: () => {
            return toolsAuth.value.find(item => item===7)
        }
    },
    {
        id: 8,
        name: '知识中心',
        path: 'https://oa.xinyuanfuwu.com/kms/knowledge/mobile/index.jsp#path=0',
        icon: Tool8,
        visible: () => {
            return toolsAuth.value.find(item => item===8)
        }
    },
    {
        id: 10,
        name: '我的草稿',
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoCaoGao.jsp',
        getUrlApi: GetSSOUrl,
        icon: Tool10,
        visible: () => {
            return toolsAuth.value.find(item => item===9)
        }
    },
    {
        id: 11,
        name: '同程商旅',
        path: '',
        icon: Tool11,
        visible: () => {
            return toolsAuth.value.find(item => item===11)
        }
    }
]);
const toolVisible = (x) => {
    if (x.visible) {
        return x.visible()
    }
    return false
}
const toolClickHandle = async (data) => {
    let { path, id, getUrlApi } = data
    if (getUrlApi) {
        const response = await getUrlApi({id: id});
        path = response.data;
        location.href = path
        return
    }
    if (id===11) {
        try {
            const a = await GetMobileBusinessTravelUrl();
            path = a.data;
        } catch {}
        location.href = path
        return
    }

    specialHandle({
        path
    })
}

const bannerData = ref([
    // {
    //     id: 1,
    //     img: Banner1,
    //     path: 'https://oa.xinyuanfuwu.com/sys/news/sys_news_main/sysNewsMain.do?method=view&fdId=18652e5368b16c1cacb434344a990028'
    // },
    // {
    //     id: 2,
    //     img: Banner2,
    //     path: 'https://oa.xinyuanfuwu.com/sys/news/sys_news_main/sysNewsMain.do?method=view&fdId=1849e495ae0d4d0976ae93f44529d7e6'
    // },
    // {
    //     id: 3,
    //     img: Banner3,
    //     path: 'https://oa.xinyuanfuwu.com/sys/news/sys_news_main/sysNewsMain.do?method=view&fdId=182a9a344e287fc6a2ebe9247ef85714'
    // },
    {
        id: 4,
        img: Banner4,
        path: 'https://www.xypm.hk'
    }
]);

const newsData = ref([]);
const informActive = ref('1979f783088eaecc4510ea84156ae689');
const informTabs = ref([
    {
        name: '1979f783088eaecc4510ea84156ae689',
        label: '集团公告'
    },
    {
        name: '18210aa5f3535dc9e5576834901b156b',
        label: '分子公司公告'
    }
    // {
    //     name: '1868b5a783d65b149f8af654d54892c6',
    //     label: '1895公告'
    // },
    // {
    //     name: '187e350e0683d3a79c32370441db8117',
    //     label: '物管公告'
    // },
    // {
    //     name: '18c173fb97e4b68c1e6f13041f59b986',
    //     label: '商管公告'
    // },
    // {
    //     name: '18285942433d1a54753ec23418d8f263',
    //     label: '科技公告'
    // },
    // {
    //     name: '182d8b0b64ee1027bf10a5143ef87e36',
    //     label: '多经公告'
    // }
]);

const informMoreClickHandle = () => {
    specialHandle({
        path: `https://oa.xinyuanfuwu.com/sys/news/mobile/index.jsp`
    })
}

const tabsChangeHandle = () => {
    newsData.value = []
    getInformData()
}

const getTools = () => {
    GetToolsData({
        userId: store.getters['user/userInfo'].user.userId
    }).then(res => {
        if (res.isOk&&res.data) {
            let { tools } = res.data
            const { ismoAttendance } = res.data
            if (!tools) tools = '[5,6,7,8,11]'
            if (ismoAttendance && ismoAttendance == '是') tools = '[1,2,3,4,5,6,7,8,9,10,11]'
            toolsAuth.value = JSON.parse(tools)
        } else {
            toolsAuth.value = [5,6,7,8,11]
        }
    })
}

const getPortlet = () => {
    GetPortletDatas().then(res => {
        bannerData.value = res||[]
    })
}

const getInformData = () => {
    GetNewsDatas({
        cateid: informActive.value,
        rowsize: 10
    }).then(res => {
        const datas = JspData(res)
        newsData.value = datas
    })
}

const newsClickHandle = (data) => {
    const {id} = data
    specialHandle({
        path: `https://oa.xinyuanfuwu.com/sys/news/sys_news_main/sysNewsMain.do?method=view&fdId=${id}`
    })
}

const specialHandle = (cur) => {
    const { path } = cur;
    if (!path) return;
    const a = document.createElement('a')
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.href = path
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
const notifyInfo = ref({
  todoing: 0,
  flow: 0,
  type_1:0
});
const getNotifyData = () => {
  notifyInfo.value["todoing"] = 0;
  notifyInfo.value["type_1"] = 0;
  notifyInfo.value["flow"] = 0;
  cmsApi.applyTaskList().then((res) => {
    if (res&&res.data) {
        notifyInfo.value["flow"] += Number(res.data.total);
    }
  });

//   GetNotify({
//     method: "sumTodoCount",
//   }).then((res) => {
//     for (let i in res) {
//       notifyInfo.value[i] += Number(res[i]);
//     }
//   });
//   GetFlowNum({
//     method: "getCount",
//     type: "approved",
//   }).then((res) => {
//     notifyInfo.value.flow += Number(res.count || 0);
//   });
  GetDoneData({
    currentPage: 1,
    pageSize: 20,
    queryParam: {
        'title$VLK': ''
    }
    }).then((res) => {
        notifyInfo.value["todoing"] = res.data.total
    })
};
const isBpmUser = ref(false) // 用来判断是否展示新的bpm
const getBpmList = async () => {
    const bpmRes = await cmsApi.bpmMydefinitionListUrl({});
    const definitList = bpmRes.data;
    if (!definitList || definitList.length === 0) {
        isBpmUser.value = false;
        return;
    }
    isBpmUser.value = true;
}
const todo = ()=>{
    localStorage.setItem("taskTabActive", 'a')
    router.push("/task")
    return;
    let path = 'https://oa.xinyuanfuwu.com/sys/notify/mobile/index.jsp'
    specialHandle({
        path: path
    })
}
const tomy = ()=>{
    let path = isBpmUser.value?`${BpmUri}/app/bpm/applyList`:`https://oa.xinyuanfuwu.com/km/review/mobile/index.jsp#path=1`;
    specialHandle({
        path: path
    })
}
const getData = () => {
    // 工具
    getTools()
    // banner
    // getPortlet()
    // 公告
    getInformData()
    // 代办
    getNotifyData()
    // 流程
    getBpmList()
}
getData();
</script>

<style lang="scss" scoped>
.home-view {
    min-height: 100vh;
    background-color: #EEF1FC;
    font-size: 30PX;
    color: $base-color-3;
    padding: 20PX;
    position: relative;
    div {
        position: relative;
        z-index: 1;
    }
    div.home-view-linear {
        position: absolute;
        top: 0;
        left: -20PX;
        width: calc(100% + 20PX);
        height: 720PX;
        background: linear-gradient(180deg, #3380FF 14.7%, rgba(255, 255, 255, 0) 43.26%);
        z-index: 0;
    }
    .home-view-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 38PX;
        font-weight: 500;
        padding: 20PX 0;
        .more-btn {
            display: inline-flex;
            align-items: center;
            height: 30PX;
            font-size: 24PX;
            color: #96969C;
            font-weight: 400;
            padding-right: 24PX;
            background-image: url('./images/arrow.svg');
            background-repeat: no-repeat;
            background-position: center right;
            background-size: 24PX auto;
        }
    }
    .home-view-t {
        font-weight: 500;
        line-height: 42PX;
        display: flex;
        & > div {
            flex: 1;
            border-radius: 24PX;
            border: 4PX solid;
            border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.1) 100%);
            padding: 20PX;
        }
        & > div+div {
            margin-left: 20PX;
        }
        .t-num {
            font-weight: 600;
            line-height: 50PX;
            margin-top: 10PX;
        }
        .todo {
            background: url('./images/icon1.svg') no-repeat center right 15PX, linear-gradient(179.9deg, #FFF2E9 0.09%, #FFFFFF 68.26%);
        }
        .flow {
            background: url('./images/icon2.svg') no-repeat center right 15PX, linear-gradient(179.9deg, #D7E6FF 0.09%, #FFFFFF 61.26%);
        }
        .todo,
        .flow {
            background-size: 62PX auto;
        }
    }
    .home-tools,
    .home-news {
        background-color: #fff;
        border-radius: 20PX;
        margin-top: 10PX;
    }
    .home-tools {
        display: flex;
        flex-wrap: wrap;
        font-size: 24PX;
        padding: 16PX 0;
        & > div {
            width: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 20PX 0;
            cursor: pointer;
        }
        .tool-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            width: 70PX;
            height: 70PX;
            margin-bottom: 20PX;
            & > img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .home-news {
        padding: 0 10PX;
        & > div {
            padding: 30PX 20PX;
            cursor: pointer;
        }
        & > div+div {
            border-top: 1PX solid #EEEEEE;
        }
        .news-title {
            font-size: 28PX;
            font-weight: 500;
            line-height: 40PX;
            margin-bottom: 10PX;
        }
        .news-time {
            color: $base-color-9;
            font-size: 24PX;
            line-height: 34PX;
        }
    }
    .news-tabs {
        display: flex;
        align-items: center;
        padding: 0 0 0px 0;
        .van-tabs {
            flex: 1;
            margin-left: -10px;
        }
        .more-btn {
            display: inline-flex;
            align-items: center;
            height: 30PX;
            font-size: 24PX;
            color: #96969C;
            font-weight: 400;
            padding-right: 24PX;
            background-image: url('./images/arrow.svg');
            background-repeat: no-repeat;
            background-position: center right;
            background-size: 24PX auto;
        }
    }
    .banner-view {
        width: 100%;
        height: 250PX;
        border-radius: 20PX;
        overflow: hidden;
        & > .van-image {
            width: 100%;
            height: 100%;
        }
    }
    .portal-layouts-footer {
        margin-top: 10px;
    }
}
</style>
<style lang="scss">
.home-view {
    .news-tabs {
        .van-tab {
            font-size: 17px;
            .van-tab__text {
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 10PX;
                    border-radius: 5PX;
                    position: absolute;
                    bottom: -3PX;
                    left: 0;
                }
            }
        }
        .van-tabs__nav {
            & > div + div {
                margin-left: 30px;
            }
        }
        .van-tab--active {
            .van-tab__text {
                &:after {
                    background: linear-gradient(90deg, #3380FF 0%, rgba(51, 128, 255, 0) 100%);
                }
            }
        }
    }
}
</style>