export default {
    namespaced:true,
    state:{
        spinShown:false
    },
    getters:{},
    mutations:{
        spinChange(state,data){
            state.spinShown = data;
        }
    },
    actions:{}

}