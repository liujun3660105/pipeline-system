import Axios from 'axios'
export const getPolygonbydraw=(drawGeoWkt,zy,gj,ylz,msfs,gjvalue)=>{
  return Axios.request({
    method:'get',
    url:'/api/distance/getPolygon',
    params:{
      drawGeoWkt:drawGeoWkt,
      zy:zy,
      gj:gj,
      ylz:ylz,
      msfs:msfs,
      gjvalue:gjvalue
    }
  })
};
