//当modal状态发生改变时，清除地图上所有的selectfeature和uploadfeature
export default {
  namespaced:true,
  state:{
    modalState:true,
  },
  getters:{},
  mutations:{
    modalStateChange(state,data){
      state.modalState=data;
    }
  },
  actions:{}
}
