export default {
  namespaced: true,
  state:{
    isDraw:false,
    moduleType:'',
    isDrawShown:true
  },
  mutations:{
    isDrawChange(state,data){
      state.isDraw=data;
    },
    moduleTypeChange(state,data){
      state.moduleType=data;
    },
    isDrawShownChange(state,data){
      state.isDrawShown=data;
    }

  }
}
