import Axios from 'axios'
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
