export default {
  state:{
    geomWKT:''
  },
  getters:{},
  mutations:{
    distanceGeometryChange(state,data){
      state.geomWKT=data;
    }
  },
  actions:{}
}
