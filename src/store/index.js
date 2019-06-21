import Vue from 'vue'
import Vuex from 'vuex'
import layer from './modules/layer'
import search from './modules/search'
import user from './modules/user'
import access from './modules/access'
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
    user,
    access
  }
})
