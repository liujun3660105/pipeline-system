export default {
  state:{
    searchParams:{
      searchKeyWord:'',
      searchType:''
    },
    features:[],
    isDraw:false,
    geomWKT:'',
    DbClickRowXmId:''
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
    geometryChange(state,data){
      state.geomWKT=data;
    },
    DbClickRowXmIdChange(state,data){
      state.DbClickRowXmId=data;
    }
    // drawChange(state,data){

    //   state.draw=data;
    // },
    // geometryChange(state,data){
    //   state.geometry=data;
    // }


  },
  actions:{}

}
