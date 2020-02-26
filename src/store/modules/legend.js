export default {
    namespaced:true,
    state:{
      selectedList:[],
    },
    getters:{},
    mutations:{
        selectedListChange(state,data){
        state.selectedList=data;
      }
    },
    actions:{}
  }