import { Login, GetUserInfo } from '@/api/user';
import { LanLingCookie } from '@/api/oa'
import { getAccessToken, removeAccessToken, setAccessToken, getUserId, setUserId, removeUserId, getOaToken, setOaToken, removeOaToken, getCookieByKey, setCookieByKey, removeCookieByKey } from '@/utils/accessToken';
import router from "@/router";
import { setting } from '@/config/setting';
const { captchaKey, qywxKey, wxpcKey } = setting.loginType
const NotFirstKey = 'xinyuan-first-redirect'
const LoginnameKey = 'LOGINNAME'

const state = {
  accessToken: getAccessToken(),
  oaToken: getOaToken(),
  userId: getUserId(),
  userInfo: null,
  notFirst: getCookieByKey(NotFirstKey)==='true',
  loginRedirectUrl: '',
  loginname: getCookieByKey(LoginnameKey),
  notSkip: false
};

const getters = {
  accessToken: (state) => state.accessToken,
  userId: (state) => state.userId,
  userInfo: (state) => state.userInfo,
  notFirst: (state) => state.notFirst,
  loginRedirectUrl: (state) => state.loginRedirectUrl,
  loginname: (state) => state.loginname,
  oaToken: (state) => state.oaToken
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUserInfo(state, data) {
    state.userInfo = data
  },
  setUserId(state, id) {
    state.userId = id;
    setUserId(id)
  },
  setOaToken(state, token) {
    state.oaToken = token;
    setOaToken(token)
    if (!token) return;
    if (state.notSkip) return;
    this.commit('user/skip')
  },
  setNotFirst(state, value) {
    state.notFirst = value;
    setCookieByKey(NotFirstKey,value)
  },
  setLoginRedirectUrl(state, value) {
    state.loginRedirectUrl = value||'';
  },
  setLoginname(state, value) {
    state.loginname = value;
    setCookieByKey(LoginnameKey,value)
  },
  setNotSkip(state, value) {
    state.notSkip = value
  },
  skip(state) {
    if (import.meta.env?.VITE_DOMIN==='.xinyuanfuwu.com') {
      if (state.loginRedirectUrl) {
        if (state.loginRedirectUrl.indexOf('http')!==-1) {
          location.href = state.loginRedirectUrl
        } else {
          router.push(state.loginRedirectUrl)
        }
        return
      }
      router.push('/')
      return
    };
    if (state.loginRedirectUrl) {
      if (state.loginRedirectUrl.indexOf('http')!==-1) {
        location.href = state.loginRedirectUrl
      } else {
        router.push(state.loginRedirectUrl)
      }
      return
    }
    const token = state.oaToken
    if (!token) {
      router.push('/')
      return
    };
    location.href = `https://jumpportal.xinyuanfuwu.com/redirect.html?LtpaToken1=${encodeURIComponent(token)}&domain=.xinyuanfuwu.com&path=${encodeURIComponent(location.origin)}`
  }
};
const actions = {
  async login({commit,dispatch}, data) {
    // console.log(data)
    // commit('setUserId', '');
    commit('setUserInfo', null);
    commit('setOaToken', null);
    commit('setNotFirst', null);
    // commit('setLoginname', null);
    const { type } = data
    const params = {}
    if (type===captchaKey) {
      const { account, password, key, code } = data
      params.account = account
      params.password = password
      params.key = key
      params.code = code
    }
    if (type===qywxKey) {
      const { validateCode } = data
      params.validateCode = validateCode
    }
    if (type===wxpcKey) {
      const { validateCode } = data
      params.validateCode = validateCode
    }
    try {
      const result = await Login(type, params)
      // const { AuthInfo, LanLing, code } = result
      // const { accessToken, userId } = AuthInfo
      const { access_token, ltpaToken1 } = result.data
      commit('setAccessToken', access_token);
      // commit('setUserId', userId);
      // commit('setLoginname', code)

      // const result2 = LanLing.find(item => item.indexOf('LtpaToken1')!=-1)
      // const LtpaToken1 = result2.split(';')[0].split('LtpaToken1=')[1]
      if (ltpaToken1) {
        commit('setOaToken', ltpaToken1)
      } else {
        commit('skip')
      }

      await dispatch('getUserInfo');
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getUserInfo({ commit, dispatch, state }) {
    if (state.userInfo) return true
    try {
      const result = await GetUserInfo();
      const { data } = result
      if (data) commit('setUserInfo', data)
    } catch {

    }
  },
  async getOaToken({ commit, state }) {
    if (state.oaToken) return
    if (!state.userInfo) return
    const data = await LanLingCookie({
      loginName: state.userInfo.account
    })
    try {
      const result = data.find(item => item.indexOf('LtpaToken1')!=-1)
      const LtpaToken1 = result.split(';')[0].split('LtpaToken1=')[1]
      commit('setOaToken', LtpaToken1)
    } catch {
      
    }
  },
  async logout({ dispatch }) {
    // await Logout(state.accessToken);
    await dispatch('resetAccessToken');
    router.push('/login');
  },
  resetAccessToken({ commit }) {
    commit('setAccessToken', '');
    // commit('setUserId', '');
    commit('setUserInfo', null);
    commit('setOaToken', null);
    commit('setNotFirst', null);
    // commit('setLoginname', null);
    removeAccessToken();
    removeUserId();
    removeOaToken();
    removeCookieByKey(NotFirstKey);
  },

  async skip({ commit, state }, path) {
    if (!state.notFirst) {
      commit('setNotFirst', true)
      const token = state.oaToken
      window.open(`https://portal.xinyuanfuwu.com/redirect.html?LtpaToken1=${encodeURIComponent(token)}&domain=.xinyuanfuwu.com&path=${encodeURIComponent(path)}`, '_blank')
    }
  },

  async setLoginRedirectUrl({ commit, state }, path) {
    commit('setLoginRedirectUrl', path)
  },
  async setNotSkip({ commit, state }, value) {
    commit('setNotSkip', value)
  },
  async setTokens({ commit, state, dispatch }, data) {
    await commit('setNotSkip', true)
    await commit('setAccessToken', decodeURIComponent(data.accessToken));
    // await commit('setUserId', data.userId);
    // await commit('setLoginname', data.loginname)
    await commit('setOaToken', decodeURIComponent(data.oaToken))
    await dispatch('getUserInfo');
  }
};
export default { state, getters, mutations, actions };
