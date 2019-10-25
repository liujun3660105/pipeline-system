export default {
  namespaced:true,
  state:{
    uploadFeatures:null,
  },
  getters:{},
  mutations:{
    uploadFeaturesChange(state,data){
      state.uploadFeatures=data;
    }
  },
  actions:{}
}
