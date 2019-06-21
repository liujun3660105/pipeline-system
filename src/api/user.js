import Axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
// import Vue from 'vue'
export const TOKEN_KEY = 'token';
export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1})//设置5分钟后过期
};
export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
};
export const login=({userName,password})=>{
  return Axios.request({
    method:'post',
    url:'/login',
    data:qs.stringify({
      userName:userName,
      password:password
    })
  })
};
export const getUserInfo=(token)=>{
  return Axios.request({
    method:'get',
    url:'get_info',
    params:{
      token:token
    }
  })
};
