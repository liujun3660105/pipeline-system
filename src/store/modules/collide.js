export default {
  namespaced:true,
  state:{
    uploadFeatures:null,
    DbClickRowXmId:''
  },
  getters:{},
  mutations:{
    uploadFeaturesChange(state,data){
      state.uploadFeatures=data;
    }


  },
  actions:{}
}
