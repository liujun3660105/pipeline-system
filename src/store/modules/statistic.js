export default {
  state:{
    geomWKT:''
  },
  getters:{},
  mutations:{
    statisticGeometryChange(state,data){
      state.geomWKT=data;
    }
  },
  actions:{}
}
