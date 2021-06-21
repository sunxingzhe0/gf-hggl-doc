import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = modulesFiles(modulePath).default
  return modules
}, {})

export default new Vuex.Store({
  getters,
  state: {},
  actions: {},
  mutations: {},
  modules: {
    ...modules,
  },
  plugins: [
    createPersistedState({
      key: 'webHospital',
      paths: ['business', 'drug'],
    }),
  ],
})
