import Axios from 'axios'
export const getTotalLength=()=>{
  return Axios.request({
    method:'get',
    url:'/api/statistic/getTotalLength'
  })
};
export const getChartInitData=(geom,dataType)=>{
  return Axios.request({
    method:'get',
    url:'/api/statistic/getChartInitData',
    params:{
      geom:geom,
      dataType:dataType
    }
  })
}
