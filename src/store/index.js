/**
 * Vuex docs
 * https://vuex.vuejs.org/zh-cn
 * https://github.com/vuejs/vue-hackernews-2.0
 */

import Vue from 'vue'
import Vuex from 'vuex'

// // Make sure state writeable
// import * as state from './state' // prop readonly
import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const modules = {}

const strict = process.env.NODE_ENV !== 'production'

const plugins = []

const store = new Vuex.Store({ state, getters, mutations, actions, modules, strict, plugins })

// ## Initial
// store.dispatch('initToken')
// // change axios authorization header
// axios.defaults.headers.Authorization = `Bearer ${storage.get('wedn_net_access_token')}`

// ## Hot module replacement
if (module.hot) {
  module.hot.accept([
    './getters',
    './mutations',
    './actions'
  ], () => {
    store.hotUpdate({
      getters: require('./getters'),
      mutations: require('./mutations'),
      actions: require('./actions')
    })
  })
}

export default store

// // accept first param must be literal !!!
// if (module.hot) {
//   const accepts = [
//     './getters',
//     './mutations',
//     './actions'
//   ]
//   module.hot.accept(accepts, () => {
//     store.hotUpdate({
//       getters: require('./getters'),
//       mutations: require('./mutations'),
//       actions: require('./actions')
//     })
//   })
// }
