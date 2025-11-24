<template>
    <div class="agent-view">
        <el-button @click="start">开始</el-button>
        <el-button @click="end">结束</el-button>

        <el-button @click="luFun">质检</el-button>
        <el-button @click="huaFun">发送话术</el-button>
        <el-button @click="qinFun">情绪识别</el-button>
    </div>
</template>

<script setup>
import { GetThread, GetData } from './api'

let downT = 0;

// 录音质检
const LuId = '61f45520-860d-4f4e-a3fb-6595b3acf877'
const LuKey = 'sk-x-KJnkj1rxlWakQqSjnyiCI_h98UkzGSEibUYby0Zf2rOUGpVFQFIpO-xhcwTMWAli21zjcuE-b7UMztJvFFMDFDtaOr_PGyeeY-gE'
const luFun = async () => {
    // if (downT%5 !== 0) return;
    const threadData = await GetThread({
        apiKey: LuKey
    })
    GetData({
        thread_id: threadData.thread_id,
        apiKey: LuKey,
        assistantId: LuId,
        input: '按照规则质检，最终输出文件地址',
        content: '[客服]您好，鑫苑服务，请问有什么需要帮您？\n[业主]呃，我是苏州新悦，新悦国际这里的。\n[客服]请问是苏州国际城市花园小区吗先生？\n',
        emp_no: '0',
        sound_recording_id: '0'
    }).then(res => {
        // console.log(res)
    })
};
// 话术辅助
const HuaId = '1c83f093-b600-48c4-9e01-733f51e8ba5e'
const HuaKey = 'sk-x-1uYpYSH46l4jXCtp7vwE6CS6Y6Mn7ldsY9dE4t6bTdgAwklMQmhXB76JczlgbHk31DCKow2qMqb98zK64ktk4J_z-ZNBA3xeFwgc'
let hua_thread_id = ''
const huaFun = async () => {
    // if (downT%2 !== 0) return;
    if (!hua_thread_id) {
        const threadData = await GetThread({
            apiKey: HuaKey
        })
        hua_thread_id = threadData.thread_id
    }
    GetData({
        thread_id: hua_thread_id,
        apiKey: HuaKey,
        assistantId: HuaId,
        runKey: 'stream',
        input: `[业主]：请查一下郑州鑫苑名家的派出所电话是什么？`
    }).then(res => {
        // console.log(res)
    })
};
// 情绪识别
const QinId = '4d0fbfa0-4c15-4931-8cd7-f4dee50db6d2'
const QinKey = 'sk-x-BR5J5qD5duGlI2d12MPqD5IK6VVdvp-iiO_FsM8B8iJkjnke24MX5cPsIcPvWuQ5r34rZfrLNAZdt266jt0huOKnVBfom56eqADj'
let qin_thread_id = ''
const qinFun = async () => {
    // if (downT%2 !== 0) return;
    if (!qin_thread_id) {
        const threadData = await GetThread({
            apiKey: QinKey
        })
        qin_thread_id = threadData.thread_id
    }
    GetData({
        thread_id: qin_thread_id,
        apiKey: QinKey,
        assistantId: QinId,
        input: `[业主]：你们物业怎么这样！能不能干！`
    }).then(res => {
        // console.log(res)
    })
};
let inter
const start = () => {
    downT = 0;
    hua_thread_id = '';
    qin_thread_id = '';
    inter = setInterval(() => {
        downT++
        // luFun();
        huaFun();
        // qinFun();
    }, 1000)
};
const end = () => {
    clearInterval(inter)
};
</script>

<style lang="scss" scoped>
.agent-view {
    padding: 20px;
}
</style>
