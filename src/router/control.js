/**
 *
 * @description 路由控制
 */
import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // console.log(to)
  let hasToken = store.getters['user/accessToken']
  if (to.query&&to.query.accessToken) {
    if (to.query.accessToken!==hasToken) {
      await store.dispatch('user/resetAccessToken');
      await store.dispatch('user/setTokens', to.query)
    }
    if (to.query.redirect_url) {
      let redirect_url = to.query.redirect_url.replace(/\*/g, '&')
      location.href = redirect_url
      return
    }
    next(to.path)
  }
  let cacheCode = localStorage.getItem('login-code')||''
  if (to.path==='/login'&&to.query.code&&to.query.code!==cacheCode) {
    hasToken = ''
    await store.dispatch('user/resetAccessToken');
  }
  const isAuth = to.meta.isAuth||to.meta.isAuth===undefined
  if (hasToken) {
    if (isAuth) await store.dispatch('user/getUserInfo');
    if (to.path==='/login') {
      if (to.query.redirect_url) {
        let redirect_url = to.query.redirect_url.replace(/\*/g, '&')
        location.href = redirect_url
        return
      }
      next('/')
    } else {
      next()
    }
  } else {
    // 免登录路由
    if (!isAuth) {
      next()
    } else {
      if (to.path==='/login') {
        next()
        return
      }
      next(`/login?redirect_url=${encodeURIComponent(to.fullPath)}`)
    }
  }
  NProgress.done();
  // document.title = getPageTitle(to.meta.title);
});
router.afterEach(() => {
  NProgress.done();
});
