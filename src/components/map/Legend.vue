<template>
  <div class="legend">
    <div class="legend-content" :class="{'active':isActive}">
      <div class="legend-content-img">
        <h2>图例</h2>
        <!-- <img  :src="legendImgUrl" alt="图例"> -->
        <ul>
          <span class="legend-control" :class="{'item-active':allActive}" @click="handleAllActive">全部</span>
          <li v-for="(item,index) in colorConfig" :key="index" @click="itemClick(item.gxdldm)" :class="{'item-active':selectedList.indexOf(item.gxdldm)>-1}"> 
            
              <span class="item-color" :style="{'background':item.color}"></span>
              <span class="item-name">{{item.name}}</span>
            
            
            </li>
        </ul>
      </div>

      <span @click="changeLegendControl" class="iconfont" v-html="legendIcon" title="图例"></span>
    </div>
    <!--<div class="legend-arrow" >-->
    <!---->
    <!--</div>-->
  </div>
</template>

<script>
  import config from '@/config';
  import {mapState,mapMutations} from 'vuex'
    export default {
        name: "Legend",
      data(){
          return {
            legendShow:false,
            legendIcon:"&#xe6a2;",
            isActive:false,
            legendImgUrl:config.layerUrl+'/geoserver/pipeline/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=100&HEIGHT=40&LAYER=pipeline:prospectlinegcj&LEGEND_OPTIONS=bgColor:0xFFFFFF',
            colorConfig : [
              {name:'给水',gxdldm:'JS',color:"#0000FF"},
              {name:'中水',gxdldm:'ZS',color:"#00EEEE"},
              {name:'排水',gxdldm:'PS',color:"#7F0000"},
              {name:'燃气',gxdldm:'RQ',color:"#FF00FF"},
              {name:'电力',gxdldm:'DL',color:"#FF0000"},
              {name:'电信',gxdldm:'DX',color:"#00FF00"},
              {name:'热力',gxdldm:'RL',color:"#854C99"},
              {name:'工业',gxdldm:'GY',color:"#FFDF7F"},
              {name:'其它',gxdldm:'QT',color:"#d8d1c7"}
              ],
            selectedList:['JS','ZS','PS','RQ','DL','DX','RL','GY','QT'],//初始状态下是全部选中
            allActive:true
          }
      },
      methods:{
        ...mapMutations('legend',[
          'selectedListChange'
        ]),
        changeLegendControl(){
          this.legendShow=!this.legendShow;
          this.legendIcon=this.legendShow? "&#xe6a4;":"&#xe6a2;"
          this.isActive=!this.isActive;
        },
        //每次点击图例中的选项触发
        itemClick(name){
          //如果点中的item已经在seletedList中，则在数组中移除
          if(this.selectedList.indexOf(name)>-1){
            let index = this.selectedList.indexOf(name);
            this.selectedList.splice(index,1);
            this.selectedListChange(this.selectedList);
          }
          //否则就添加进seletedList
          else{
            this.selectedList.push(name);
            this.selectedListChange(this.selectedList);
          }
          
        },
        //设置全部显示和隐藏
        handleAllActive(){
          this.allActive=!this.allActive;
          if(this.allActive){
            this.selectedList=['JS','ZS','PS','RQ','DL','DX','RL','GY','QT'];
            this.selectedListChange(this.selectedList);
            
          }
          else{
            this.selectedList=[];
            this.selectedListChange(this.selectedList);
          }
        }
      }
    }
</script>

<style scoped>
.legend {
  /*width:20px;*/
  height: 100%;
  width: 0px;
  position: absolute;
  left: 0px;
  background: #45494a;
  z-index: 1;
  background: rgba(0, 0, 0, 0);
}
.legend-content {
  width: 0px;
  float: left;
  background: white;
  height: 100%;
  transition: width 0.3s;
  position: relative;
}
.active {
  width: 200px;
}
.legend-arrow {
  text-align: center;
  width: 50px;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0);
}
.legend-content-img {
  overflow: hidden;
}
.legend-content-img h2 {
  margin: 10px 20px;
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
  background: #1d1c10;
  color: white;
  position: absolute;
  top: calc(50% - 10px);
  right: -20px;
  cursor: pointer;
}

.legend-content-img ul li{
  height:50px;
  border-top:solid 2px gray;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  margin:0px 5px;
  list-style: none;
}
.item-color {
  display: inline-block;
  width:100px;
  height:5px;
  margin-right:30px;
}
.item-name{
  font-size:15px;
  font-weight: 600;
}
.item-active{
  background:rgb(231, 229, 229);
}
.legend-control{
  display: inline-block;
  width:190px;
  height:50px;
  line-height: 50px;
  font-size:20px;
  font-family:SimHei;
  text-align: center;
  margin:0px 5px;
  font-weight: 600;
  cursor:pointer;
}
</style>
