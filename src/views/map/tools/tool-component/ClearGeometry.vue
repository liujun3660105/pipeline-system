<template>
  <div>
    <a @click='clearGeometry()'>清除图形<Icon type="ios-trash" size="25"/></a>
  </div>
</template>

<script>
  import ready from '@/mixins/ready';
  import {mapState,mapMutations} from 'vuex'
    export default {
        name: "ClearGeometry",
      mixins: [ready],
      data(){
        return {
          keyStatus:true
        }
      },
      methods:{
          ...mapMutations('modal',[
            'modalStateChange'
            ]
          ),
          _load(){},
        clearGeometry(){
            this.keyStatus=!this.keyStatus;
            this.modalStateChange(this.keyStatus);
          }
      }
    }
</script>

<style scoped>
  .tools-ul li a{
    color:white;
    font-size:15px;
  }

</style>
