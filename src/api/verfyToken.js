import Axios from 'axios';
export const verifyToken = ()=>{
    Axios.request({
        method:'get',
        url:'/api/user/verifyToken'
    })
}