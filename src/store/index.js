import Vue from 'vue'
import Vuex from 'vuex'
import layer from './modules/layer'
import search from './modules/search'
import statistic from './modules/statistic'
import distance from './modules/distance'
import user from './modules/user'
import access from './modules/access'
import draw from './modules/draw'
import collide from './modules/collide'
import modal from './modules/modal'
import upload from './modules/upload'
import legend from './modules/legend'
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
    draw,
    distance,
    collide,
    modal,
    upload,
    legend
  }
})
