export default {
    namespaced: true,
    state:{
      isDownloadDraw:false,
      geomType:'',
      dataType:'',
      coordinateType:'',
      isClear:true,
      isExport:false,
      exportFeatures:'',
    },
    mutations:{
      isDownloadDrawChange(state,data){
        state.isDownloadDraw = data;
      },
      geomTypeChange(state,data){
        state.geomType = data;
      },
      dataTypeChange(state,data){
        state.dataType = data;
      },
      coorTypeChange(state,data){
        state.coordinateType = data;
      },
      isClearChange(state,data){
        state.isClear= data;
      },
      isExportChange(state,data){
        state.isExport = data;
      },
      exportFeaturesChange(state,data){
        state.exportFeatures = data;
      }
  
    }
  }