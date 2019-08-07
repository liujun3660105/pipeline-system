export default {
  state:{
    searchParams:{
      searchKeyWord:'',
      searchType:''
    },
    features:null,
    isDraw:false,
    geomWKT:'',
    DbClickRowXmId:'',
    selectedVectorLayer:null
  },
  mutations:{
    //选择的图层
    keyWordChange(state,data){
      state.searchParams.searchKeyWord=data.searchKeyWord;
      state.searchParams.searchType=data.searchType;
    },
    featuresChange(state,data){
      state.features=data;
    },
    isDrawChange(state,data){
      state.isDraw=data;
    },
    searchGeometryChange(state,data){
      state.geomWKT=data;
    },
    DbClickRowXmIdChange(state,data){
      state.DbClickRowXmId=data;
    },
    selectLayerChange(state,data){
      state.selectedVectorLayer=data;
    }



  },
  actions:{}

}
