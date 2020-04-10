import Axios from 'axios'
export const getUploadGeometry=(formData)=>{
  return Axios.request({
    method:'post',
    url:'/api/collide/getUploadGeometry',
    data:formData
  })
};


export const getAnalyzeGeometry=(uploadGeoJsonStr,zy,gj,ylz,msfs,gjvalue)=>{
  return Axios.request({
    method:'get',
    url:'/api/collide/getAnalyzeGeometry',
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
