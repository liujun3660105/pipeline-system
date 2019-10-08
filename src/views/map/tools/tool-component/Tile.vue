<template>
  <div>
    <a @click="BaseMapToggle">底图切换<span class="iconfont">&#xe7ff;</span></a>
  </div>
</template>
<script>
  import ready from '@/mixins/ready';
  import TileLayer from 'ol/layer/Tile';
  import XYZ from 'ol/source/XYZ';
  import {createXYZ} from 'ol/tilegrid'
  import config from '@/config'
    export default {
        name: "Tile",
      mixins: [ready],
      props:{
      },
      data(){
          return {
            XYZSourceList :[
            ],
            tileLayer:null,
            autoNaviSource:null,
            googleRaterSource:null,
            terrainSource:null,
            xyzIndex:0
          }
      },
      methods:{
          _load(){
            var extent=[117, 38.5, 118, 39.5];//显示范围
            this.autoNaviSource=new XYZ({
              url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
            });//高德source

            this.googleRaterSource=new XYZ({
              url:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
            });//google source

            var url=config.layerUrl+'/geoserver/gwc/service/tms/1.0.0/terrain%3AterrainData@EPSG%3A4326@png/';//地形图TMS服务、栅格切片
            var tileGird=createXYZ({
              extent: extent
              // maxZoom:14
              // // minZoom:1,
              // tileSize:[256,256],
              // resolutions:[0.703125, 0.3515625, 0.17578125, 0.087890625,
              //   0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625,
              //   0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4,
              //   1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5,
              //   1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6,
              //   6.705522537231445E-7, 3.3527612686157227E-7],
              // origin:[-180,-90]
            });//设置wgs84坐标系tilegrid切片规则，基本都是默认，只有extent设置成当前显示范围

            this.terrainSource=new XYZ({
              projection:'EPSG:4326',
              tileGird:tileGird,
              tileUrlFunction:function(tileCoord,pixelRatio,proj){
                return url+(tileCoord[0]-1)+ '/'+(tileCoord[1]) + '/' + (Math.pow(2,tileCoord[0]-1)+tileCoord[2]) + '.png';
              }
            });//地形图source

            this.XYZSourceList[0]=this.autoNaviSource;
            this.XYZSourceList[1]=this.googleRaterSource;
            this.XYZSourceList[2]=this.terrainSource;
            this.tileLayer=new TileLayer({
              source:this.XYZSourceList[0]
            });
            this.map.addLayer(this.tileLayer);
            // this.tileLayer=new TileLayer({
            //   source:new XYZ({
            //     url:this.XYZTileList[this.xyzIndex]
            //   })
            // });
            // this.map.addLayer(this.tileLayer);
          },
        BaseMapToggle(){
          this.xyzIndex=(++this.xyzIndex)%3;
        },
      },
      watch:{
        xyzIndex(newIndex){
          // this.tileLayer.getSource().setUrl(this.XYZTileList[newIndex]);
          this.tileLayer.setSource(this.XYZSourceList[newIndex]);
        }
      }

    }
</script>

<style scoped>
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
