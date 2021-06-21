import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import Socket from '@/components/Socket'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

Message.info = function (msg) {
  Message({
    message: msg,
    showClose: true,
  })
}
Message.warning = function (msg) {
  Message({
    message: msg,
    type: 'warning',
    showClose: true,
  })
}
Message.error = function (msg) {
  Message({
    message: msg,
    type: 'error',
    showClose: true,
  })
}
Message.success = function (msg) {
  Message({
    message: msg,
    type: 'success',
    showClose: true,
  })
}

const getUrlParams = function () {
  const url = decodeURIComponent(window.location.href)
  const index = url.indexOf('?')
  const params = {}
  if (index !== -1) {
    let queryStr = url.substring(index + 1)
    const hashIndex = queryStr.indexOf('#')
    if (hashIndex !== -1) {
      queryStr = queryStr.substring(0, hashIndex)
    }
    queryStr.split('&').forEach(item => {
      const arr = item.split('=')
      params[arr[0]] = arr[1]
    })
  }
  return params
}

// const genGetPath = function (item) {
//   let path = /^\//.test(item.path) ? '' : '/'
//   path = path + item.path
//   if (item.children && item.children.length) {
//     path = path + genGetPath(item.children[0])
//   }
//   return path
// }

export const authGuard = async function () {
  await store.dispatch('user/getInfo')
  let params = getUrlParams()
  if (params.code && params.attrs) {
    params.type = params.attrs.split('@')
    location.href = '/'
  }
  router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    const hasToken = getToken()
    // set page title
    document.title = getPageTitle(to.meta.title)
    // 优先检查code
    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      }
      if (to.path === '/404') {
        console.error('程序应跳转到对应正确路由')
        next()
      } else {
        next()
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        // next()
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })
}
