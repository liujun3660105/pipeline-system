<template>
  <div>
    <a @click='toHomeView'>视图回归<Icon type="md-home" size="25"/></a>
  </div>

</template>

<script>
  import ready from '@/mixins/ready';
    export default {
        name: "HomeView",
      mixins: [ready],
      methods:{
          _load(){},
          toHomeView(){
            this.view.setCenter([117.7,39]);
            this.view.setZoom(12);

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
