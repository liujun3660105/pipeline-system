import Axios from 'axios'
export const getUploadGeometry=(formData)=>{
  return Axios.request({
    method:'post',
    url:'get_upload_geometry',
    data:formData
  })
};


export const getAnalyzeGeometry=(uploadGeoJsonStr,zy,gj,ylz,msfs,gjvalue)=>{
  return Axios.request({
    method:'get',
    url:'get_analyze_geometry',
    params:{
      uploadGeoJsonStr:uploadGeoJsonStr,
      zy:zy,
      gj:gj,
      ylz:ylz,
      msfs:msfs,
      gjvalue:gjvalue
    }
  })
};
