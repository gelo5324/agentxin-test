<template>
  <div class="login-view" :class="{'login-view-wechat': isWeChat}">
    <template v-if="isWeChat">
      <div class="wechat-loading" v-loading="loginLoading" element-loading-text="登录中..."></div>
    </template>
    <template v-else>
      <div class="login-view-l"></div>
      <div class="login-view-r">
        <div class="login-view-form" v-loading="loginLoading">
          <Logo />
          <el-form
            ref="loginForm"
            size="default"
            label-position="top"
            :model="formData"
            :rules="rules"
            :hide-required-asterisk="true"
            @submit.native.prevent
            >
            <el-form-item label="账号" prop="account">
              <el-input v-model="formData.account" placeholder="请输入账号" @blur="accountBlurHandle" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password  @blur="passwordBlurHandle" />
            </el-form-item>
            <el-form-item label="验证码" prop="code" class="code-item" v-if="captchaSwitch">
              <el-input v-model="formData.code" placeholder="请输入验证码" />
              <div class="code-img" v-loading="codeLoading" @click="codeHandle">
                <img :src="codeImg" />
              </div>
            </el-form-item>
            <el-form-item class="reme-item">
              <el-checkbox v-model="isRemember" label="记住账号" @change="rememberChangeHandle" />
              <span class="forget-text" @click="goPwd" v-if="forgetPwdSwitch">忘记密码？</span>
            </el-form-item>
            <el-form-item>
              <el-button class="login-view-form-btn" type="primary" :loading="btnLoading" @click="loginHandle">登录</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="login-view-form-btn" @click="wxLoginHandle">企微登录</el-button>
            </el-form-item>
          </el-form>
          <wx-login @onSwitch="switchHandle" v-if="wxLoginVisible" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import router from "@/router";
import { GetAuthorizeUrl } from '@/api/wx'
import { GetCaptcha, GetLoginSwitch } from '@/api/user'
import { isWx, GetBpm } from "@/utils/index";
import Logo from '@/components/Logo.vue'
import WxLogin from './components/WxLogin.vue'
import { setting } from '@/config/setting';
const { captchaKey, qywxKey, wxpcKey } = setting.loginType

const store = useStore();
const route = useRoute();
const routeQuery = route.query;
const isWeChat = ref(isWx);
const wxLoginVisible = ref(false);
const loginLoading = ref(false);
const btnLoading = ref(false);
const captchaSwitch = ref(false);
const forgetPwdSwitch = ref(false);

const { proxy } = getCurrentInstance()

store.dispatch('user/setLoginRedirectUrl', routeQuery.redirect_url)

const loginForm = ref()
const isRemember = ref(localStorage.getItem('accountRemember')==='true')
const codeImg = ref('')
const formData = ref({
  type: captchaKey,
  account: '',
  password: '',
  code: '',
  key: ''
});
if (isRemember.value) {
  formData.value.account = localStorage.getItem('account-a')||''
  formData.value.password = localStorage.getItem('account-p')||''
}
const rules = ref({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
});

const loginHandle = () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        await store.dispatch('user/setNotSkip', false)
        await store.dispatch('user/login', formData.value)
      } catch (error) {
        getCode()
      }
      btnLoading.value = false
    } else {
      console.log('error')
    }
  })
};

const rememberChangeHandle = (val) => {
  localStorage.setItem("accountRemember", val)
  if (val) {
    const { account,password } = formData.value
    localStorage.setItem('account-a', account)
    localStorage.setItem('account-p', password)
  } else {
    localStorage.removeItem('account-a')
    localStorage.removeItem('account-p')
  }
}

const accountBlurHandle = () => {
  if (!isRemember.value) return;
  localStorage.setItem('account-a',formData.value.account)
}

const passwordBlurHandle = () => {
  if (!isRemember.value) return;
  localStorage.setItem('account-p', formData.value.password)
}

// 缓存code 防止二次请求 报错40029
const codeCacheFun = () => {
  localStorage.setItem('login-code', routeQuery.code)
}

const isCodeRepeat = () => {
  const oldCode = localStorage.getItem('login-code')||''
  const result = oldCode===routeQuery.code
  if (result) {
    router.push(`/`)
  }
  return result
}

const wxInit = async () => {
  if (routeQuery.code) {
    if (isCodeRepeat()) {
      return
    }
    loginLoading.value = true;
    codeCacheFun()
    await store.dispatch('user/setNotSkip', true)
    await store.dispatch('user/login', {
      type: qywxKey,
      validateCode: routeQuery.code
    })
    loginLoading.value = false;
    if (routeQuery.redirect_url) location.href = routeQuery.redirect_url
  } else {
    if (routeQuery.redirect_url) {
      location.href = GetAuthorizeUrl(`login?redirect_url=${routeQuery.redirect_url}`)
    } else {
      location.href = GetAuthorizeUrl()
    }
  }
}

const wxPcInit = async () => {
  if (isCodeRepeat()) {
    return
  }
  loginLoading.value = true;
  codeCacheFun()
  await store.dispatch('user/login', {
    type: wxpcKey,
    validateCode: routeQuery.code
  })
  loginLoading.value = false;
}

const codeLoading = ref(false)
const getCode = async () => {
  if (codeLoading.value) return;
  codeLoading.value = true
  const result = await GetCaptcha()
  const blob = new Blob([result]) // 返回的文件流数据
  const url = window.URL.createObjectURL(blob) // 将他转化为路径
  codeImg.value = url
  // formData.value.key = result.key
  codeLoading.value = false
}

const codeHandle = () => {
  getCode();
}

const wxLoginHandle = () => {
  if (btnLoading.value) return;
  wxLoginVisible.value = true;
}

const switchHandle = () => {
  wxLoginVisible.value = false;
}

if (isWeChat.value) {
  wxInit()
} else {
  if (routeQuery.code) {
    wxPcInit()
  } else {
    getCode()
  }
}

const enterup = (e) => {
  const { keyCode } = e
  if (keyCode===13||keyCode===100) {
    loginHandle()
  }
}

const BpmUri = GetBpm()
const goPwd = () => {
  location.href = `${BpmUri}/findPwdByEmail`
}

const getSetting = async () => {
  const result = await GetLoginSwitch();
  if (result.isOk&&result.data) {
    const [a, b] = result.data
    captchaSwitch.value = a
    forgetPwdSwitch.value = b
  }
}

getSetting()

onMounted(() => {
  window.addEventListener('keyup', enterup)
});
onBeforeUnmount(() => {
  window.removeEventListener('keyup', enterup, false)
});

</script>

<style lang="scss" scoped>
.login-view {
  width: 100%;
  height: 100%;
  display: flex;
  background: url('./images/bg.png') no-repeat left top;
  background-size: cover;
  background-color: #E9EEF5;
  &-l {
    flex: 1;
  }
  &-r {
    width: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 436px;
    // height: 476px;
    box-shadow: 0px 0px 15px 0px #0000001A;
    border-radius: 5px;
    background-color: #fff;
    padding: 30px 0 20px 0;
  }
  .xin-logo {
    width: 307px;
    margin-left: 10px;
    margin-bottom: 30px;
  }
  .login-view-form-btn {
    width: 100%;
    height: 36px;
  }
  .forget-text {
    cursor: pointer;
    color: $base-color-primary;
  }
  .code-item {
    .code-img {
      width: 80px;
      height: 100%;
      margin-left: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &.login-view-wechat {
    background: #E9EEF4;
    justify-content: center;
    align-items: center;
    .wechat-loading {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.login-view {
  .login-view-form {
    position: relative;
    overflow: hidden;
    .el-form {
      width: 300px;
    }
    .el-input__wrapper {
      border-radius: 5px;
    }
    .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
    .xin-logo-view {
      width: 300px;
      padding: 0 0 10px 0;
    }
  }
  .reme-item {
    .el-form-item__content {
      justify-content: space-between;
    }
    .wx-login {
      color: $base-color-3;
      cursor: pointer;
    }
  }
  .code-item {
    .el-form-item__content {
      justify-content: space-between;
      .el-input {
        flex: 1;
      }
    }
    .code-img {
      .el-loading-spinner {
        height: 100%;
        margin-top: -16px;
        .circular {
          width: 20px;
          height: 20px;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>