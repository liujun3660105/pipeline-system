<template>
    <div class="map" id="map">
      <Tools @tileLayerIndexChange="receiveTileLayerIndex">

      </Tools>
      <Legend></Legend>
      <!--<SpatialFilter></SpatialFilter>-->
      <DrawGeometry></DrawGeometry>
      <ShowFeatureInfo></ShowFeatureInfo>
      <SelectFeature></SelectFeature>
    </div>

</template>

<script>
  import 'ol/ol.css'
  import {Map, View} from 'ol'
  import LayerGroup from 'ol/layer/Group';
  import TileLayer from 'ol/layer/Tile'
  import ImageLayer from 'ol/layer/Image'
  import XYZ from 'ol/source/XYZ'
  // import TileLayer from 'ol/layer/Tile'
  // import XYZ from 'ol/source/XYZ'
  import OSM from 'ol/source/OSM.js'
  import {defaults} from 'ol/control/util'
  import Vector from 'ol/source/Vector'
  import VectorLayer from 'ol/layer/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import TileWMS from 'ol/source/TileWMS'
  import ImageWMS from 'ol/source/ImageWMS'
  import GeometryCollection from 'ol/geom/GeometryCollection';
  import Point from 'ol/geom/Point'
  import LineString from 'ol/geom/LineString'
  import MultiLineString from 'ol/geom/MultiLineString'
  import Feature from 'ol/Feature'
  import Collection from 'ol/Collection'
  import Cluster from 'ol/source/Cluster'
  import VectorTileLayer from 'ol/layer/VectorTile'
  import VectorTileSource from 'ol/source/VectorTile'
  import TileDebug from 'ol/source/TileDebug'
  import TileGrid from 'ol/tilegrid/TileGrid'
  import Draw from 'ol/interaction/Draw.js';
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
  import Tools from './tools'
  import {transform} from 'ol/proj'
  import {get} from 'ol/proj/projections'
  import {defaults as defaultControls} from 'ol/control.js';
  import MousePosition from 'ol/control/MousePosition.js';
  import {createStringXY} from 'ol/coordinate.js';
  import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
  import Legend from '@/components/map/Legend'
  // import SpatialFilter from '@/views/moudle/search/spatialFilter'
  import ShowFeatureInfo from '@/views/moudle/search/ShowFeatureInfo'
  import DrawGeometry from '@/components/map/DrawGeometry'
  import SelectFeature from '@/views/moudle/search/SelectFeature'
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
          themeLayers: [
            {
              value:'xm',
              layer:new TileLayer({
                source:new TileWMS({
                  url: 'http://localhost:8080/geoserver/pipeline/wms',
                  params: {
                    tiled: true,
                    "LAYERS": 'pipeline:xmline'
                  },
                  projection:'EPSG:4326'
                }),
                zIndex:2,
                visible:false
              })
            },
            {
              value:'wt',
              layer:new TileLayer({
                source:new TileWMS({
                  url: 'http://localhost:8080/geoserver/pipeline/wms',
                  params: {
                    // 'FORMAT': 'jpg',
                    // 'VERSION': '1.1.1',
                    tiled: true,
                    "LAYERS": 'pipeline:prospectData',
                    // "exceptions": 'application/vnd.ogc.se_inimage'
                    // tilesOrigin: 93615.0703125 + "," + 236681.1875,
                  },
                  projection:'EPSG:4326'
                }),
                zIndex:2,
                visible:false
              })
            },
            {
              value:'pc',
              layer:new ImageLayer({
                source:new ImageWMS({
                  url: 'http://localhost:8080/geoserver/pipeline/wms',
                  params: {
                    'FORMAT': 'image/png',
                    // 'VERSION': '1.1.1',
                    "LAYERS": 'pipeline:puchaData',
                    "exceptions": 'application/vnd.ogc.se_inimage',
                    'CQL_FILTER':"ly='普查'"
                    // tilesOrigin: 93615.0703125 + "," + 236681.1875,
                    //'CQL_FILTER': "projectid='" + projectid + "'"
                  },
                  projection:'EPSG:4326'
                }),
                zIndex:2,
                visible:false
              })
            },
            {
              value:'dh',
              layer:new ImageLayer({
                source:new ImageWMS({
                  url: 'http://localhost:8080/geoserver/pipeline/wms',
                  params: {
                    'FORMAT': 'image/png',
                    // 'VERSION': '1.1.1',
                    "LAYERS": 'pipeline:puchaData',
                    "exceptions": 'application/vnd.ogc.se_inimage',
                    'CQL_FILTER':"ly='示意'"
                    // tilesOrigin: 93615.0703125 + "," + 236681.1875,
                    //'CQL_FILTER': "projectid='" + projectid + "'"
                  },
                  projection:'EPSG:4326'
                }),
                zIndex:2,
                visible:false
              })
            },
            {
              value:'sy',
              layer:new ImageLayer({
                source:new ImageWMS({
                  url: 'http://localhost:8080/geoserver/pipeline/wms',
                  params: {
                    'FORMAT': 'image/png',
                    // 'VERSION': '1.1.1',
                    "LAYERS": 'pipeline:puchaData',
                    "exceptions": 'application/vnd.ogc.se_inimage',
                    'CQL_FILTER':"ly='调绘'"
                    // tilesOrigin: 93615.0703125 + "," + 236681.1875,
                    //'CQL_FILTER': "projectid='" + projectid + "'"
                  },
                  projection:'EPSG:4326'
                }),
                zIndex:2,
                visible:false
              })
            }


          ],
          // selectedVectorLayer:{a:1},
          // selectedVectorSource:null,
          selectedFeatures:[]
        }

      },
      computed: {
        //得到layer传过来的图层
        getSelectedLayers() {
          return this.$store.state.layer.layers;
         },
        // getKeyWord(){
        //   return this.$store.state.search.searchParams;
        // },
        //从vuex中获取features
        // getSelectedFeatures(){
        //   return this.$store.state.search.features
        //   //从后端传来的数据成果有两种形式，一种是geojson数据，一种是json数据，对应后台的sql语句
        //   //注释部分为json部分，但是feature和properities是分离的，对于后期不好实现点击查看要素信息,所以利用的是geojson数据
        //   // let selectedGeoms=[];
        //   // selectedFeatures.forEach((feature,index)=>{
        //   //   console.log(JSON.parse(feature.geom));
        //   //   selectedGeoms.push(JSON.parse(feature.geom).coordinates);
        //   // });
        // },
        // getDbClickRowXmId(){
        //   return this.$store.state.search.DbClickRowXmId;
        // },
        // getDrawGeometry(){
        //   return this.$store.state.search.geometry
        // }
      },
      components: {
        Tools,
        Legend,
        // SpatialFilter,
        ShowFeatureInfo,
        DrawGeometry,
        SelectFeature
      },
      mounted() {
        this.initMap();
        this.$emit('ready');//如果不写，则其他组件无法使用ready的混入

      },
      methods: {
        initMap() {
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
            view: this.view
          });
          this.addLayersToMap();

          //设置筛选出的要素相关图层和源
          // this.selectedVectorSource=new Vector();
          // this.selectedVectorLayer=new VectorLayer({
          //   source:this.selectedVectorSource,
          //   // new Vector({
          //   // features:features
          //   //这里features是数组
          //   // features:[new Feature({
          //   //   geometry:new MultiLineString(this.getSelectedFeatures)
          //   // })]
          //   // features:new Collection({
          //   //   array:new MultiLineString(this.getSelectedFeatures)
          //   // })
          //   // }),
          //   style:new Style({
          //     fill: new Fill({
          //       color: 'rgba(255, 255, 255, 0.2)'
          //     }),
          //     stroke: new Stroke({
          //       color: 'rgba(0, 0, 0, 0.5)',
          //       lineDash: [10, 10],
          //       width: 5
          //     }),
          //     image: new CircleStyle({
          //       radius: 5,
          //       stroke: new Stroke({
          //         color: 'rgba(0, 0, 0, 0.7)'
          //       }),
          //       fill: new Fill({
          //         color: 'rgba(255, 255, 255, 0.2)'
          //       })
          //     })
          //   }),
          //   zIndex:3
          // });
          // this.map.addLayer(this.selectedVectorLayer);

        },
        //将data中初始化的图层依次添加到地图中
        addLayersToMap(){
          this.themeLayers.forEach((layerObject,index)=>{
            if(layerObject){
              this.map.addLayer(layerObject.layer);
            }
          })
        },
        //接收从Tools传来的底图index
        receiveTileLayerIndex(index) {
          this.xyzIndex = index;
        }
      },
      watch: {
        //当layer组件中的显示图层发生变化，对themeLayers的图层进行visible设置
        getSelectedLayers(newLayerList, oldLayerList) {
        let indexList=[];
          newLayerList.forEach((layer) => {
            if(layer){
              let index = this.themeLayers.findIndex((themeLayer) => {
                return themeLayer.value === layer.value;
              });
              indexList.push(index);
              this.themeLayers[index].layer.setVisible(true);
            }
          });

          //在themeLayer中找到不属于Layer组件传过来的图层，设置成false
          let differentLayers=this.themeLayers.filter((v,i,arr)=> {return indexList.indexOf(i)<0});
          if(differentLayers.length>0){
            differentLayers.forEach((v)=>{
              v.layer.setVisible(false)
            })
          }
        },
        //对搜索的关键字和搜索类型进行监听，点击Search组件搜索按钮后，vuex中search模块的数据发生改变
        //异步获取xmline表的要素数据，更改vuex中search模块的features
        // getSelectedFeatures(newFeatureList){
        //   this.selectedVectorSource.clear();
        //   if(newFeatureList.features){//如果查询的结果不为空，则进行要素显示和定位
        //     let selectedFeatures=new GeoJSON().readFeatures(newFeatureList);
        //     this.selectedVectorSource.addFeatures(selectedFeatures);
        //     this.map.getView().fit(this.selectedVectorSource.getExtent());
        //   }
        // },

        //双击表格某一行，得到这一行数据的项目编号
        // getDbClickRowXmId(newXmId){
        //   this.selectedFeatures.forEach(feature=>{
        //     feature.setStyle(null);
        //   });
        //   this.selectedFeatures=this.selectedVectorSource.getFeatures().filter(feature=>{
        //     return feature.getProperties().xmbm===newXmId
        //   });
        //   let style=new Style({
        //     stroke: new Stroke({
        //       color: 'rgba(220, 20, 60, 0.9)',
        //       lineDash: [10, 10],
        //       width: 5
        //     }),
        //   });
        //   let geometries=[];
        //   this.selectedFeatures.forEach(feature=>{
        //     geometries.push(feature.getGeometry());
        //     feature.setStyle(style);
        //   });
        //   let geometryCollection=new GeometryCollection(geometries);
        //   this.map.getView().fit(geometryCollection.getExtent());
        // }

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
