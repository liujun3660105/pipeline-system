import Axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
export const TOKEN_KEY = 'token';
export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1})//设置一天后过期
};
export const getToken = () => {
  // const token = Cookies.get(TOKEN_KEY)
  const token = localStorage.getItem('token');
  if (token) return token
  else return false
};
export const login=({userName,password})=>{
  return Axios.request({
    method:'post',
    url:'/api/user/login',
    // data:{
    //   userName,
    //   password
    // }
    data:qs.stringify({
      username:userName,
      password:password
    })
  })
};
export const getUserInfo=(token)=>{
  return Axios.request({
    method:'get',
    // url:'get_info',
    url:"/api/user/getUserInfo",
    // params:{
    //   token:token
    // }
  })
};

//对于不经过node服务器的请求，要先经过node服务器进行Token验证
export const verifyToken = ()=>{
  return Axios.request({
      method:'get',
      url:'/api/user/verifyToken'
  })
}
