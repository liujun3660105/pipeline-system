<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <LoginForm @on-success-valid="handleSubmit"></LoginForm>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
  import LoginForm from '@/components/login-form'
  import { mapActions } from 'vuex'
    export default {
      name: "Login",
      data() {
        return {
          errInfo: ''
        }
      },
      components: {
        LoginForm
      },
      methods: {
        ...mapActions([
          'handleLogin',
          'getUserInfo'
        ]),
        handleSubmit({userName, password}) {
          this.handleLogin({userName, password}).then(res => {
            if (res.status === 200) {
              window.localStorage.setItem("token", res.data.token);
              this.getUserInfo().then(res => {
                this.$router.push({
                  name: 'home'
                })
              })
            } else {
              this.errInfo = res.data;
              this.$Notice.error({
                title:this.errInfo
              });
            }
          })
        }
      }
    }
</script>

<style scoped>


</style>
