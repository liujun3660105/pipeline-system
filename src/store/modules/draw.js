export default {
  namespaced: true,
  state:{
    isDraw:false,
    moduleType:'',
    isDrawShown:true,
    isDownloadDraw:false,
    geomType:''
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
    },
    isDownloadDrawChange(state,data){
      state.isDownloadDraw = data;
    },
    geomTypeChange(state,data){
      state.geomType = data;
    }

  }
}
