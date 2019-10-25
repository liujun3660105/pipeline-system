<template>
    <div class="tools">
      <ul class="tools-ul">
        <!--<li class="tools-ul-li" v-for="item in toolList"><a @click="toolMeasurementCall(item.methodName)">{{ item.title}}<Icon :type="item.iconType" size="25"></Icon></a>-->
        <!--</li>-->
        <!--<Icon type="ios-information-circle" />信息查看-->
        <!--<Icon type="md-resize" /> 测量-->
        <li><GetFeatureInfo></GetFeatureInfo></li>
        <li><MeasureTool></MeasureTool></li>
        <li><Magnify></Magnify></li>
        <li><Tile></Tile></li>
        <li><FullScreen v-model="isFullScreen"></FullScreen></li>
        <!--<Icon type="md-contract" />-->
        <li><HomeView></HomeView></li>
      </ul>


    </div>
</template>

<script>
  import {FullScreen,Tile,MeasureTool,HomeView,Magnify,GetFeatureInfo} from './tool-component'
    export default {
        name: "Tools",
      components:{
        FullScreen,
        Tile,
        MeasureTool,
        HomeView,
        Magnify,
        GetFeatureInfo,
      },
      data(){
          return {
            isFullScreen:false
          }
      },
      // props:{
      //   value:{
      //     type:Boolean,
      //     default:false
      //   }
      // },
      methods:{
        /**
         * Message to show when the user is drawing a polygon.
         * @type {string}
         */
        fullScreenChange(){
          this.isFullScreen=!this.isFullScreen;
          // this.$emit('input',!this.value);
        }
      },
      computed:{

      },
    }
</script>

<style scoped>

  .tools{
    width:500px;
    height:50px;
    background:rgba(0,0,0,0.5);
    border-radius:15px;
    position:absolute;
    top:10px;
    right:220px;
    z-index:5;


  }
  .tools-ul li{
    display:inline-block;
    float:left;
    width:80px;
    height:50px;
    list-style: none;
    text-align: center;

  }
  .tools-ul li a{
    color:white;
    font-size:15px;
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 25px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: -5px;
    display: inline-block;
  }

</style>
