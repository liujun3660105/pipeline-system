import Vue from 'vue'
import Vuex from 'vuex'
import layer from './modules/layer'
import search from './modules/search'
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
    // layerChange(context,data){
    //   context.commit('layerChange',data);
    // }
  },
  modules: {
    layer,
    search

  }
})
