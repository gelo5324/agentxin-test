import { createRouter, createWebHistory } from 'vue-router'
import Layouts from '@/layouts/index.vue'
import Home from '@/views/home/index'
import Login from '@/views/login/index.vue'
import Qywx from '@/views/qywx/index.vue'
import ManageLayouts from '@/manage/layouts/index.vue'
import ManageUser from '@/manage/views/user/index.vue'
import Done from '@/bpm-views/done.vue'
import Skip from '@/ping-views/skip.vue'
import Task from '@/views/task/index'
import TaskSearch from '@/views/task-search/index.vue'
import Fyskip from '@/fy-views/skip.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index',
      meta: {
        
      },
      component: Layouts,
      children: [
        {
          path: '/index',
          name: 'Index',
          meta: {
        
          },
          component: Home
        },
        {
          path: '/manage',
          redirect: '/manage/user',
          meta: {
        
          },
          component: ManageLayouts,
          children: [
            {
              path: '/manage/user',
              name: 'mUser',
              meta: {
        
              },
              component: ManageUser
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        isAuth: false
      },
      component: Login
    },
    {
      path: '/qywx',
      name: 'Qywx',
      meta: {
        isAuth: false
      },
      component: Qywx
    },
    {
      path: '/done',
      name: 'Done',
      meta: {
        isAuth: false
      },
      component: Done
    },
    {
      path: '/task',
      name: 'Task',
      meta: {
        // isAuth: false
      },
      component: Task
    },
    {
      path: '/search',
      name: 'Search',
      meta: {
        // isAuth: false
      },
      component: TaskSearch
    },
    {
      path: '/skip', // 鑫智屏企微跳转使用
      name: 'Skip',
      meta: {
        isAuth: false
      },
      component: Skip
    },
    {
      path: '/fyskip/:id', // 费用跳转使用
      name: 'Fyskip',
      meta: {
        isAuth: false
      },
      component: Fyskip
    },
    {
      path: '/code',
      name: 'Code',
      meta: {
        isAuth: false
      },
      component: () => import('@/bpm-views/code.vue')
    },
    {
      path: '/newsSpecial/:id',
      name: 'NewsSpecial',
      meta: {
        isAuth: true
      },
      component: () => import('@/views/special-page/index.vue')
    },
    {
      path: '/test',
      name: 'Test',
      meta: {
        isAuth: false
      },
      component: () => import('@/views/test/index.vue')
    },
    {
      path: '/agent',
      name: 'Agent',
      meta: {
        isAuth: false
      },
      component: () => import('@/agentxin/index.vue')
    }
  ],
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router;
