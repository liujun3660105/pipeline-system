<template>
  <div></div>
</template>

<script>
  import ready from '@/mixins/ready'
  import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js'
  import Vector from 'ol/source/Vector'
  import VectorLayer from 'ol/layer/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import {mapState} from 'vuex'

  export default {
    name: "ShowUploadFile",
    mixins: [ready],
    data() {
      return {
        uploadFileVectorLayer:null,
        uploadFileVectorSource:null
      }
    },
    methods: {
      _load() {
        //设置筛选出的要素相关图层和源
        this.uploadFileVectorSource=new Vector();
        this.uploadFileVectorLayer=new VectorLayer({
          source:this.uploadFileVectorSource,
          style:this.featureStyleFunction,
          zIndex:4
        });
        this.map.addLayer(this.uploadFileVectorLayer);
      },
      featureStyleFunction(feature){
        // console.log(feature);
        let color = feature.getProperties().color
        let image = new CircleStyle({
          radius: 2,
          fill: new Fill({color: 'rgb('+color+')'}),
          stroke: new Stroke({color: 'rgb('+color+')', width: 1})
        });
        let text = new Text({
          text:feature.getProperties().text? feature.getProperties().text: '',
          font:'20px sans-serif',
          textAlign:'left',
          fill:new Fill({color: 'rgb('+color+')'})
        });

        let styles = {
          'Point': new Style({
            image: image,
            text:text
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'rgb('+color+')',
              width: 1
            })
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: 'rgb('+color+')',
              width: 1
            })
          }),
          'MultiPoint': new Style({
            image: image
          }),
          'MultiPolygon': new Style({
            stroke: new Stroke({
              color: 'rgb('+color+')',
              width: 1
            }),
            fill: new Fill({
              color: 'rgb('+color+')'
            })
          }),
          'Polygon': new Style({
            // stroke: new Stroke({
            //   color: 'rgb('+color+')',
            //   lineDash: [4],
            //   width: 3
            // }),
            fill: new Fill({
              color: 'rgb('+color+')'
            })
          }),
          'GeometryCollection': new Style({
            stroke: new Stroke({
              color: 'rgb('+color+')',
              width: 2
            }),
            fill: new Fill({
              color: 'rgb('+color+')'
            }),
            image: new CircleStyle({
              radius: 10,
              fill: null,
              stroke: new Stroke({
                color: 'rgb('+color+')'
              })
            })
          }),
          'Circle': new Style({
            stroke: new Stroke({
              color: 'rgb('+color+')',
              width: 2
            }),
            fill: new Fill({
              color: 'rgb('+color+')'
            })
          })
        };
        return styles[feature.getGeometry().getType()];
      }
    },
    computed: {
      ...mapState('upload',[
        'uploadFeatures'
      ]),
      ...mapState('modal',[
        'modalState'
      ]),
    },
    watch: {
      //异步获取xmline表的要素数据，更改vuex中search模块的features
      uploadFeatures(newFeatureList){
        // console.log(newFeatureList);
        this.uploadFileVectorSource.clear();
        if(newFeatureList.features||newFeatureList.geometries){//如果查询的结果不为空，则进行要素显示和定位
          //collide中如果上传的文件时火星坐标系，则不需要数据库进行转换，直接读取shp文件的geojson，格式为{"type":"FeatureCollection","geometries:[{"type":"LineString","coor"}]"}
          let uploadFeatures=new GeoJSON().readFeatures(newFeatureList);
          this.uploadFileVectorSource.addFeatures(uploadFeatures);
          this.map.getView().fit(this.uploadFileVectorSource.getExtent());
          // console.log(this.uploadFileVectorSource.getExtent());

        }
      },
      modalState(newState){
        this.uploadFileVectorSource.clear();
      }
    }
  }
</script>

<style scoped>

</style>

