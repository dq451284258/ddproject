import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import layout from '../views/layout'
import layoutM from '../wmeeting/layoutM'
import layoutWork from '../viewsWork/layoutWork'

export const constantRouterMap = [
  // { path: '/login', component: () => import('@/views/login/index') },
  {
    path: '/',
    component: layout,
    name: 'projects',
    children: [
      {
        path: '',
        component: () => import('@/views/projects'),
        meta: { title: '我的项目' }
      }, {
        path: 'create/:id',
        component: () => import('@/views/projects/create'),
        meta: { title: '预立项' }
      }, {
        path: 'preview/:id',
        component: () => import('@/views/projects/preview'),
        meta: { title: '预立项' }
      }, {
        path: 'handing/:id',
        component: () => import('@/views/projects/handingPreview'),
        meta: { title: '进行中' }
      }, {
        path: 'edit/:id',
        component: () => import('@/views/projects/edit'),
        meta: { title: '进行中' }
      }, {
        path: 'preview/:id/buy',
        component: () => import('@/views/projects/buy'),
        meta: { title: '我的项目' }
      }, {
        path: 'preview/:id/buy/:buyid',
        component: () => import('@/views/projects/addbuy'),
        meta: { title: '我的项目' }
      }, {
        path: 'aproval/:id',
        component: () => import('@/views/projects/aprovalPreview'),
        meta: { title: '我的项目' }
      }, {
        path: 'formalEdit/:id',
        component: () => import('@/views/projects/formalEdit'),
        meta: { title: '正式生产性立项' }
      }, {
        path: 'lastEdit/:id',
        component: () => import('@/views/projects/lastEdit'),
        meta: { title: '我的项目' }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    name: 'login',
    children: [
      {
        path: 'login',
        component: () => import('@/views/login/index'),
        meta: { title: '登录' }
      }
    ]
  },
  { path: '/404', component: () => import('@/views/404') },
  { path: '*', redirect: '/404' },
  { path: '/test', component: () => import('@/views/test') },


  { path: '/write', name: 'write',component: () => import('@/viewsWork/write/write') },
  { path: '/moblieWrite', meta: { title: '工时登记' }, name: 'moblieWrite',component: () => import('@/viewsWork/write/moblieWrite') },
  // { path: '/workHour', name: 'workHour',component: () => import('@/viewsWork/workHour') },
  { path: '/export', name: 'export',component: () => import('@/viewsWork/export/export') },
  { path: '/examine', name: 'examine',component: () => import('@/viewsWork/examine/examine') },
  { path: '/moblieExamine',meta: { title: '工时审批' }, name: 'moblieExamine',component: () => import('@/viewsWork/examine/moblieExamine') },
  { path: '/dateRang', name: 'dateRang',component: () => import('@/viewsWork/examine/dateRang') },
  { path: '/aaa', name: 'aaa',component: () => import('@/viewsWork/export/aaa') },
  //会议室预定
	{
	    path: '/layoutM',
	    component: layoutM,
	    name: 'reserve',
	     children: [
//	      {
//	        path: '/index',
//	        component: () => import('@/wmeeting/reserve/index'),
////	        meta: { title: '会议' }
//	      },
	      {
		      path: '/room',
		      component: () => import('@/wmeeting/reserve/barContent/room'),
		      meta: { title: '会议室预约' }
		    },
		    {
		      path: '/meeting',
		      component: () => import('@/wmeeting/reserve/barContent/meeting'),
		      meta: { title: '会议' }
		    },
	      {
		      path: '/mine',
		      component: () => import('@/wmeeting/reserve/barContent/mine'),
		      meta: { title: '我的' }
        },
        {
          path: '/book',
		      component: () => import('@/wmeeting/reserve/barContent/book/book'),
		      meta: { title: '会议室预约' }
        },
        {
          path: '/cancle',
		      component: () => import('@/wmeeting/reserve/barContent/cancle'),
		      meta: { title: '会议室预约' }
        },
        {
          path: '/success',
		      component: () => import('@/wmeeting/reserve/barContent/success'),
		      meta: { title: '会议室预约' }
		    },

	    ]
  },
  {
    path: '/workHour',
    component: layoutWork,
    name: 'workHour',
     children: [
        { path: '',
          component: () => import('@/viewsWork/workHour')
        },


      ]
  },
]

export default new Router({
  routes: constantRouterMap
})
