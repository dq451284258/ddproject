import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


const whiteList = ['/login', '/']
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : ''
  next()
  NProgress.start()
  // if (getToken()) {
  //   if (to.path === '/login') {
  //     next({ path: '/' })
  //     // NProgress.done()
  //   } else {
  //     if (store.getters.roles.length === 0) {
  //       store.dispatch('GetMessage').then(res => {
  //         next()
  //       }).catch((err) => {
  //         // store.dispatch('FedLogOut').then(() => {
  //         //   Message.error(err || 'Verification failed, please login again')
  //         //   next({ path: '/' })
  //         // })
  //       })
  //     } else {
  //       next()
  //     }
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next('/login')
  //     // NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  NProgress.done()
})
