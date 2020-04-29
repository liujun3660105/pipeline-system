//全局清除地图上的几何图形  工具栏 清除图形
export default {
  namespaced:true,
  state:{
    globalFeatures:null,
    DbClickRow:''
  },
  mutations:{
    //选择的图层
    globalFeaturesChange(state,data){
      state.globalFeatures=data;

  },
  DbClickRowChange(state,data){
    state.DbClickRow = data;
  }
}
}
