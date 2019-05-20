<template>
    <div class="legend">
      <div class="legend-content" :class="{'active':isActive}">
        <div class="legend-content-img">
          <h2>图例</h2>
          <img  :src="legendImgUrl" alt="图例">
        </div>

        <span @click="changeLegendControl" class="iconfont" v-html="legendIcon" title="图例"></span>
      </div>
      <!--<div class="legend-arrow" >-->
        <!---->
      <!--</div>-->

    </div>
</template>

<script>
    export default {
        name: "Legend",
      data(){
          return {
            legendShow:false,
            legendIcon:"&#xe6a2;",
            isActive:false,
            legendImgUrl:'http://localhost:8080/geoserver/pipeline/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=100&HEIGHT=40&LAYER=pipeline:prospectlinegcj&LEGEND_OPTIONS=bgColor:0xFFFFFF'
          }
      },
      methods:{
        changeLegendControl(){
          this.legendShow=!this.legendShow;
          this.legendIcon=this.legendShow? "&#xe6a4;":"&#xe6a2;"
          this.isActive=!this.isActive;
        }
      }
    }
</script>

<style scoped>
  .legend{
    /*width:20px;*/
    height:100%;
    width:0px;
    position:absolute;
    left:0px;
    background:#45494a;
    z-index:1;
    background:rgba(0,0,0,0);
  }
  .legend-content{
    width:0px;
    float:left;
    background:white;
    height:100%;
    transition:width 0.5s;
    position:relative;
  }
  .active{
    width:200px;
  }
  .legend-arrow{
    text-align: center;
    width:50px;
    height:100%;
    position:absolute;
    background:rgba(0,0,0,0);


  }
  .legend-content-img{
    overflow: hidden;
  }
  .legend-content-img h2{
    margin:10px 20px;
  }
/*.legend-img{*/
  /*width:auto;*/

  /*max-width:100%;*/

/*}*/
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 20px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background:#1d1c10;
    color:white;
    position:absolute;
    top:calc(50% - 10px);
    right:-20px;
    cursor:pointer;
  }


</style>
