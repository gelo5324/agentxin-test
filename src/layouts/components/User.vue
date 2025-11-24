<template>
    <el-popover trigger="hover" placement="bottom-end" transition="" popper-class="user-view-popover" :offset="24">
        <template #reference>
            <div class="user-view">
                <el-image class="user-avatar" :src="userInfo.photo" fit="cover" v-if="userInfo.photo" />
                <div class="user-avatar user-avatar-name" v-else>
                    {{ userInfo.fullName.slice(-2) }}
                </div>
                <div class="user-nickname">{{ userInfo.fullName }}</div>
            </div>
        </template>
        <!-- <div v-if="isAdmin" @click="goManageHandel">管理中心</div> -->
        <div @click="goUpdatePaw">修改密码</div>
        <div v-if="isAdmin||isBpmUser" @click="goBpm">管理后台</div>
        <div @click="logoutHandle">退出登录</div>
    </el-popover>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex';
import { GetBpm } from '@/utils/index'
import * as cmsApi from "@/api/innerMsg";
const store = useStore();
const userInfo = computed(() => {
    return store.getters['user/userInfo'].user||{};
});

const isAdmin = computed(() => {
    return userInfo.value.username==='admin'
});

const goManageHandel = () => {
    window.open(`${location.origin}/manage`, '_blank')
};
const logoutHandle = async () => {
    await store.dispatch('user/logout')
};
const goUpdatePaw = () => {
    window.open(`${GetBpm()}/dashboard/user/updatePassword`, '_blank')
};
const goBpm = ()=>{
    window.open(`${GetBpm()}`, '_blank')
}

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
getBpmList();
</script>

<style lang="scss" scoped>
.user-view {
    margin: 0 20px 0 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: $base-color-3;
    cursor: pointer;
    .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }
    .user-avatar-name {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--el-color-primary);
        color: #fff;
        font-size: 12px;
    }
    .user-nickname {
        margin-left: 10px;
    }
}
.user-view-popover {
    & > div {
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        cursor: pointer;
    }
}
</style>

<style lang="scss">
.el-popover.el-popper.user-view-popover {
    padding: 0;
}
.user-view {
    .el-image__error {
        font-size: 10px;
    }
}
</style>