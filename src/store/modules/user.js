import { setToken,getToken,login,getUserInfo} from '@/api/user'

export default {
  state:{
    userName:'',
    token:getToken(),
    access:'',
    hasGetInfo: false
  },
  mutations:{
    setToken(state,token){
      state.token=token;
      setToken(token)
    },
    setUserName(state,userName){
      state.userName=userName;
    },
    setAccess (state, access) {
      state.access = access
    },
    setHasGetInfo(state,status){
      state.hasGetInfo=status;

    }
  },
  actions:{
    handleLogin(context,{userName,password}){
      userName=userName.trim();
      return new Promise((resolve,reject)=>{
        login({userName,password}).then(res=>{
          console.log(res);
            // let data=res.data;
            // context.commit('setToken',data.token);
            resolve(res);
          }
        ).catch(err=>{
          reject(err);
        })
      })


    },
    getUserInfo ( {state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data;
            commit('setUserName', data.data.userName.trim());
            commit('setAccess', data.data.access.trim());
            resolve(data)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    handleLogOut (context) {
      return new Promise((resolve, reject) => {
        localStorage.removeItem("token");
          // context.commit('setToken', '')
          // context.commit('setAccess', '')
          resolve()
        // 如果退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
      })
    },


  }
}
