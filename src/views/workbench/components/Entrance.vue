<template>
  <div class="entrance-view" :class="entranceData.class || ''" :style="entranceData.style || {}" @click="entranceClickHandle">
    <div class="entrance-icon" :style="{ background: `${entranceData.bg}` }">
        <img :src="entranceData.icon" :style="entranceData.imgStyle || {}" />
    </div>
    <div class="entrance-label">{{ entranceData.label }}</div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GetStudyUrl, GetBusinessTravelUrl, XinspaceLoginLog } from '@/api/workbench'

export default {
  name: 'entrance-view',
  props: {
    entranceData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const specialHandle = (cur) => {
      const { path } = cur;
      if (!path) return;
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = path;
      a.rel = "noreferrer";
      a.click();
    };

    const store = useStore();
    const userInfo = computed(() => store.getters["user/userInfo"] || {});
    
    const entranceClickHandle = async () => {
      try {
        const { id, path, getUrlApi } = props.entranceData;
        let finalPath = path;
        if (getUrlApi) {
          const response = await getUrlApi();
          finalPath = response.data;
        }
        switch(id) {
          case "7":
            const studyResponse = await GetStudyUrl();
            const { url } = JSON.parse(studyResponse.data);
            finalPath = url;
            break;
          case "13":
            const travelResponse = await GetBusinessTravelUrl();
            finalPath = travelResponse.data;
            break;
          case "9":
          case "10":
            const { encryptedAccount } = userInfo.value;
            finalPath = `${path}${encryptedAccount || ""}`;
            break;
          case "12":
            XinspaceLoginLog();
            break;
        }

        specialHandle({ path: finalPath });
      } catch (error) {
        console.error('处理入口点击时发生错误:', error);
      }
    }
    onMounted(() => {})
    return {
        entranceClickHandle
    }
  }
}
</script>

<style lang="scss" scoped>
.entrance-view {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  font-size: 12px;

  .entrance-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: #008fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    overflow: hidden;

    & > img {
      height: 24px;
    }
  }

  .entrance-label {
    line-height: 20px;
    text-align: center;
    margin-top: 5px;
  }

  &:hover {
    color: $base-color-primary;
  }

  &.rent-view {
    .entrance-icon {
      & > img {
        width: 62px;
        height: 62px;
      }
    }
  }
}
</style>