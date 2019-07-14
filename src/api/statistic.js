import Axios from 'axios'
export const getTotalLength=()=>{
  return Axios.request({
    method:'get',
    url:'get_total_length'
  })
};
export const getChartInitData=(geom,dataType)=>{
  return Axios.request({
    method:'get',
    url:'get_chart_init_data',
    params:{
      geom:geom,
      dataType:dataType
    }
  })
}
