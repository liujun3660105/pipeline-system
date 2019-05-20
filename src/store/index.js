import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    layers:[]
    //
  },
  mutations: {
    layerChange(state,data){
      state.layers=data
    }
    //
  },
  actions: {
    //
    // layerChange(context,data){
    //   context.commit('layerChange',data);
    // }
  },
  modules: {

  }
})
