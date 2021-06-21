import { getToken, setToken, removeToken } from '@/utils/auth'
import local from '@/utils/local'
import router, { resetRouter, asyncRouter } from '@/router'
import { login, logout, getInfo } from '@/api/user'

const state = {
  token: getToken(),
  name: '',
  logo: '',
  avatar: '',
  introduction: '',
  roles: [],
  userId: '',
  socketToken: '',
  orgName: '',
  orgId: '',
  dept: {
    list: [],
    id: '',
    name: '',
  },
  store: {
    list: [],
    id: '',
    name: '',
  },
  platform: '',
  title: '',
  titleId: '',
  account: '',
  phone: '',
  roleName: '',
  roleList: [],
  workHistroy: '',
  workNo: '',
  hasExamine: '',
  hasAuth: '',
  platformCode: '',
  //账户角色列表
  userTypeList: [],
  menus: local.get('menus'),
  userInfo: '',
}

const mutations = {
  SET_LOGO: (state, logo) => {
    state.logo = logo
  },
  SET_MAIL: (state, mail) => {
    state.mail = mail
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_SOCKET_TOKEN: (state, socketToken) => {
    state.socketToken = socketToken
  },
  SET_ORG_NAME: (state, orgName) => {
    state.orgName = orgName
  },
  SET_ORG_ID: (state, orgId) => {
    state.orgId = orgId
  },
  SET_DEPT: (state, dept) => {
    state.dept = dept
  },
  SET_DEFAULT_DEPT: (state, dept) => {
    state.dept.id = dept.id
    state.dept.name = dept.name
  },
  SET_STORE: (state, store) => {
    state.store = store
  },
  SET_DEFAULT_STORE: (state, store) => {
    state.store.id = store.id
    state.store.name = store.name
  },
  SET_PLATFORM: (state, platform) => {
    state.platform = platform
  },
  SET_PLATFORM_CODE(state, plylod) {
    state.platformCode = plylod
  },
  SET_TITLE: (state, title) => {
    state.title = title
  },
  SET_TITLE_ID: (state, titleId) => {
    state.titleId = titleId
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_IDENT: (state, identityType) => {
    state.identityType = identityType
  },

  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ROLENAME: (state, roleName) => {
    state.roleName = roleName
  },
  SET_ROLELIST: (state, roleList) => {
    state.roleList = roleList
  },
  SET_WORKHISTORY: (state, workHistory) => {
    state.workHistory = workHistory
  },
  SET_WORKNO: (state, workNo) => {
    state.workNo = workNo
  },
  SET_HASEXAMINE: (state, hasExamine) => {
    state.hasExamine = hasExamine
  },
  SET_HASAUTH: (state, hasAuth) => {
    state.hasAuth = hasAuth
  },
  SET_YF: (state, YF) => {
    state.YF = YF
  },
  SET_USERTYPE: (state, userTypeList) => {
    state.userTypeList = userTypeList
  },
  SET_MENUS(state, menus) {
    state.menus = menus
  },
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
}

const actions = {
  login({ commit }, userInfo) {
    const { account, password } = userInfo

    return new Promise((resolve, reject) => {
      login({
        account: account.trim(),
        password: password,
      })
        .then(response => {
          const { token, accessCodes } = response
          const menus = asyncRouter(accessCodes)
          commit('SET_TOKEN', token)
          commit('SET_MENUS', menus)
          setToken(token)
          local.set('menus', menus)
          local.set('accessCodes', accessCodes)
          resolve()
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit, dispatch, state }) {
    console.log(123)
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(data => {
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          commit('SET_USERINFO', data)
          commit('SET_LOGO', data.logo)
          commit('SET_MAIL', data.mail)
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.avatar)
          /* commit('SET_INTRODUCTION', data.introduction) */
          commit('SET_SOCKET_TOKEN', data.imToken)
          commit('SET_USERID', data.userId)
          commit('SET_YF', data.storeList?.[0]?.id)

          commit('SET_ORG_NAME', data.orgName)
          commit('SET_ORG_ID', data.orgId)
          commit('SET_DEPT', {
            list: data.deptList,
            id: data.deptId,
            name: data.deptName,
          })
          // console.log(router)
          commit('SET_STORE', {
            list: data.storeList ?? [],
            id: data.storeList?.[0]?.id,
            name: data.storeList?.[0]?.name,
          })
          commit('SET_PLATFORM', data.clientType)
          commit('SET_PLATFORM_CODE', data.platOrgId)
          commit('SET_TITLE', data.titleName)
          commit('SET_TITLE_ID', data.titleId)
          commit('SET_ACCOUNT', data.account)
          commit('SET_IDENT', data.identityType)
          commit('SET_PHONE', data.phone)
          commit('SET_ROLENAME', data.roleName)
          commit('SET_ROLELIST', data.roleList)
          commit('SET_WORKHISTORY', data.workHistory)
          commit('SET_WORKNO', data.workNo)
          commit('SET_HASEXAMINE', data.hasExamine)
          commit('SET_HASAUTH', data.hasAuth)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  // occupied 账号是否被占用
  async logout({ commit, state, dispatch }, occupied = false) {
    if (occupied) {
      commit('SET_TOKEN', '')
      commit('SET_SOCKET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      local.remove('menuTree')
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })
    } else {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(async () => {
            commit('SET_TOKEN', '')
            commit('SET_ZYTOKEN', '')
            commit('SET_SOCKET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            local.remove('menuTree')
            resetRouter()

            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            dispatch('tagsView/delAllViews', null, { root: true })

            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ZYTOKEN', '')
      commit('SET_SOCKET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      local.remove('menuTree')
      router.push('/login')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    /* eslint-disable-next-line no-async-promise-executor */
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true,
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
