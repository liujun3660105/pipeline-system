import Vue from 'vue'
import Vuex from 'vuex'
import layer from './modules/layer'
import search from './modules/search'
import statistic from './modules/statistic'
import user from './modules/user'
import access from './modules/access'
import draw from './modules/draw'
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {

  },
  modules: {
    namespaced: true,
    layer,
    search,
    statistic,
    user,
    access,
    draw
  }
})
