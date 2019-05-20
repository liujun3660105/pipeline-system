<template>
    <div class="map" id="map">
      <Tools @tileLayerIndexChange="receiveTileLayerIndex">

      </Tools>

      <Legend></Legend>

    </div>

</template>

<script>
  import 'ol/ol.css'
  import {Map, View} from 'ol'


  import LayerGroup from 'ol/layer/Group';
  import TileLayer from 'ol/layer/Tile'
  import XYZ from 'ol/source/XYZ'
  // import TileLayer from 'ol/layer/Tile'
  // import XYZ from 'ol/source/XYZ'
  import OSM from 'ol/source/OSM.js'
  import {defaults} from 'ol/control/util'
  import VectorLayer from 'ol/layer/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import TileWMS from 'ol/source/TileWMS'
  import Vector from 'ol/source/Vector'
  import Cluster from 'ol/source/Cluster'
  import VectorTileLayer from 'ol/layer/VectorTile'
  import VectorTileSource from 'ol/source/VectorTile'
  import TileDebug from 'ol/source/TileDebug'
  import TileGrid from 'ol/tilegrid/TileGrid'
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
  import Tools from './tools'
  import {transform} from 'ol/proj'
  import {get} from 'ol/proj/projections'
  import {defaults as defaultControls} from 'ol/control.js';
  import MousePosition from 'ol/control/MousePosition.js';
  import {createStringXY} from 'ol/coordinate.js';
  import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
  import Legend from '@/components/map/Legend'
    export default {
      name: "Map",
      provide() {
        return {
          mapComponent: this
        };
      },
      data() {
        return {
          map: null,
          view: null,
          xyzIndex: 0,
          prospectWMSLayer: null,
          pcWMSLayer: null,
          themeLayers: [
            {
              value: 'pc',
              layer: null
            },
            {
              value: 'wt',
              layer: null
            }
          ]

        }

      },
      computed: {
        getSelectedLayers() {
          // let newLayers=[];
          // let layers=this.$store.state.layers;
          // // this.map.addLayer(layers[0]);
          // //过滤那些空的图层
          // layers.forEach(layer=>{
          //   if(layer){
          //     newLayers.push(layer);
          //   }
          // });
          // console.log(newLayers,'computed计算结果');
          // return newLayers;
          return this.$store.state.layers;
        }

      },
      components: {
        Tools,
        Legend

      },
      mounted() {
        this.initMap();
        this.$emit('ready');//如果不写，则其他组件无法使用ready的混入

      },
      methods: {
        initMap() {
          //物探数据WMS图层
          this.prospectWMSLayer = new TileLayer({
            source: new TileWMS({
              url: 'http://localhost:8080/geoserver/pipeline/wms',
              params: {
                // 'FORMAT': 'jpg',
                // 'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": 'pipeline:puchaData',
                // "exceptions": 'application/vnd.ogc.se_inimage'
                // tilesOrigin: 93615.0703125 + "," + 236681.1875,
              },
              projection: 'EPSG:4326'
            }),
            zIndex: 2,
            visible: false
          });
          //普查图层
          this.pcWMSLayer = new TileLayer({
            source: new TileWMS({
              url: 'http://localhost:8080/geoserver/pipeline/wms',
              params: {
                // 'FORMAT': 'jpg',
                // 'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": 'pipeline:prospectData',
                // "exceptions": 'application/vnd.ogc.se_inimage'
                // tilesOrigin: 93615.0703125 + "," + 236681.1875,
              },
              projection: 'EPSG:4326'
            }),
            zIndex: 2,
            visible: false
          });
          this.themeLayers[0].layer = this.prospectWMSLayer;
          this.themeLayers[1].layer = this.pcWMSLayer;



          var projectionExtent = [-180, -90, 180, 90];//坐标系范围
          var extent = [117, 38.5, 118, 39.5];//显示范围


          //切片编号调试图层
          // var tileDebugLayer=new TileLayer({
          //   source:new TileDebug({
          //     projection:'EPSG:4326',
          //     tileGrid:tileGird,
          //     extent:extent
          //   }),
          //   zIndex:4
          // });//测试瓦片


          //设置视图
          this.view = new View({
            zoom: 12,
            center: [117.7, 39],
            projection: 'EPSG:4326',
            extent: extent,
            minZoom:11
          });

          //设置鼠标移动时显示坐标值得控件
          var mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326'
            // className: 'custom-mouse-position'
          });

          //设置map
          this.map = new Map({
            target: 'map',
            controls: defaultControls().extend([mousePositionControl]),
            interactions: defaultInteractions().extend([
              new DragRotateAndZoom()
            ]),
            // layers:[
            //   new TileLayer({
            //     source: new XYZ({
            //       // url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            //       url:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
            //     })
            //   })
            // ],
            view: this.view
          });
          this.map.addLayer(this.prospectWMSLayer);
          this.map.addLayer(this.pcWMSLayer);

          // this.map.addLayer(this.prospectWMSLayer);

          // this.themeLayers.forEach(layer=>{
          //   if(layer){
          //     this.map.addLayer(layer)
          //   }
          //
          // })
          // this.map.addLayers(this.thhemeLayers);
        },

        //接收从Tools传来的底图index
        receiveTileLayerIndex(index) {
          this.xyzIndex = index;
        }

      },
      watch: {
        getSelectedLayers(newLayerList, oldLayerList) {
        let indexList=[];
          newLayerList.forEach((layer) => {
            let index = this.themeLayers.findIndex((themeLayer) => {
              return themeLayer.value === layer.value;
            });
            indexList.push(index);
            this.themeLayers[index].layer.setVisible(true);
            //   let index=this.themeLayers.indexOf(layer);//当前layer在themeLayers中的索引值
            //   if(index!==-1){ //layer在themeLayers中已经存在
            //     layer.setVisible(true);
            //     //把不在themeLayers中的图层关掉
            //   }
            //   else{
            //     //如果之前不存在 map就把这个新图层加载进来
            //
            //     this.themeLayers.push(layer);
            //     // this.map.addLayer(this.prospectWMSLayer);
            //     // this.map.removeLayer(layer);
            //   }
            // });
            //把themeLayers中，不在选中的图层中的图层的隐藏
            //newLayerList.indexOf(v)<0



          });
          let differentLayers=this.themeLayers.filter((v,i,arr)=> {return indexList.indexOf(i)<0});
          console.log(differentLayers);
          if(differentLayers.length>0){
            differentLayers.forEach((v)=>{
              v.layer.setVisible(false)
            })
          }
        }
      }
    }
</script>

<style scoped>
.map{
/*两个作用,为了让map这个窗口自适应content这个div,还有就是getfeaturesbypixel包括draw鼠标*/
  position:fixed;
  width:100%;
  height:100%;
}

</style>
