<style lang="less">
  @import './user.less';
</style>
<template>
  <div class="user-avatar-dropdown">
    <Dropdown trigger="click" @on-click="handleClick" >
      <Badge dot>
        <Avatar :src=avatarSrc />
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="information" class="information" >
          <span class="username">{{userName}}</span>
          <span >{{getUserLevel}}</span>
        </DropdownItem>
        <DropdownItem @click="logout" divided name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
    export default {
        name: "UserInfo",
      data(){
          return {
            userName:'',
            avatarSrc:require("@/assets/images/avatar.png")
          }
      },
      methods: {
        ...mapActions([
          'handleLogOut'
        ]),
        handleClick(name){
          if(name==='logout'){
            this.logout();
          }
        },
        logout () {
          this.handleLogOut().then(() => {
            console.log('aaa');
            this.$router.push({
              name: 'login'
            })
          })
        }
      },
      computed:{
          getUserLevel(){
            let level= this.$store.state.user.access;
            switch(level){
              case 'admin':
                return 'VIP用户'
              case 'visitor':
                return '高级用户'
              default:
                return '普通用户'
            }

          }
      },
      mounted(){

      },
      created(){
        this.userName=this.$store.state.user.userName;
      }
    }
</script>

<style scoped>
  .information{
    height:100px;


  }
  .information span{
    height:40px;
    line-height:40px;
    text-align:center;
    display:block;
  }

  .username{
    font-size:15px;
    font-weight: bold;
  }
  .user-avatar-dropdown{
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
  }


</style>
