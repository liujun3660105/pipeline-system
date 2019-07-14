export default {
  namespaced: true,
  state:{
    isDraw:false,
    moduleType:''
  },
  mutations:{
    isDrawChange(state,data){
      state.isDraw=data;
    },
    moduleTypeChange(state,data){
      state.moduleType=data;
    }

  }
}
