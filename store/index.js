import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import getters from './getter'
Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state,
    mutations,
    actions,
    getters
  })

export default store
