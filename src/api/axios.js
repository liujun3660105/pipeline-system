import Axios from 'axios'
//接口地址前缀
Axios.defaults.baseURL ='http://192.168.1.225:5000';
//请求拦截器
Axios.interceptors.request.use((config)=>{
  return config;
},(error)=>{
  return Promise.reject(error)
});
//响应拦截器
Axios.interceptors.response.use((config)=>{
  return config
},(error)=>{
  return Promise.reject(error)
});
export default Axios;
