import Axios from 'axios'
import router from '../router';
import store from '@/store';
//接口地址前缀
Axios.defaults.baseURL ='http://192.168.1.225:5000';
// Axios.defaults.baseURL ='http://192.168.1.225:5001';
// Axios.defaults.baseURL ='http://localhost:5000';
//请求拦截器
Axios.interceptors.request.use((config)=>{
  if(config.url.indexOf("geoserver")===-1 || config.url.indexOf("fme")===-1){
    const token = window.localStorage.getItem("token");
    if(token){
      //判断token是否存在，如果存在，则每个http header都加上token
      //Bearer 是JWT的认证头信息
      config.headers.common["Authorization"] = "Bearer "+token;
    }

  }
  store.commit('spin/spinChange',true);
  return config;
},(error)=>{
  return Promise.reject(error)
});
//响应拦截器
Axios.interceptors.response.use((res)=>{
  store.commit('spin/spinChange',false);
  return res
},(error)=>{
  store.commit('spin/spinChange',false);
  const code = error.response.status;
  if(code === 401){
    localStorage.removeItem("token");
    router.push('/login')
  }
  return Promise.reject(error)
});
export default Axios;
