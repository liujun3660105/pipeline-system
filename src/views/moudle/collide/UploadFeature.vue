<template>
    <div></div>
</template>

<script>
  import ready from '@/mixins/ready'
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js'
  import Vector from 'ol/source/Vector'
  import VectorLayer from 'ol/layer/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import {mapState} from 'vuex'

  export default {
    name: "UplodFeature",
    mixins: [ready],
    data() {
      return {
        uploadVectorLayer:null,
        uploadVectorSource:null
      }
    },
    methods: {
      _load() {
        //设置筛选出的要素相关图层和源
        this.uploadVectorSource=new Vector();
        this.uploadVectorLayer=new VectorLayer({
          source:this.uploadVectorSource,
          style:new Style({
            stroke: new Stroke({
              color: 'rgba(119,136,153, 0.9)',
              // lineDash: [10, 10],
              width: 4
            })
          }),
          zIndex:3
        });
        this.map.addLayer(this.uploadVectorLayer);
      }
    },
    computed: {
      ...mapState('collide',[
        'uploadFeatures'
      ]),
      ...mapState('modal',[
        'modalState'
      ]),
    },
    watch: {
      //异步获取xmline表的要素数据，更改vuex中search模块的features
      uploadFeatures(newFeatureList){
        this.uploadVectorSource.clear();
        if(newFeatureList.features||newFeatureList.geometries){//如果查询的结果不为空，则进行要素显示和定位
          //collide中如果上传的文件时火星坐标系，则不需要数据库进行转换，直接读取shp文件的geojson，格式为{"type":"FeatureCollection","geometries:[{"type":"LineString","coor"}]"}
          let uploadFeatures=new GeoJSON().readFeatures(newFeatureList);
          this.uploadVectorSource.addFeatures(uploadFeatures);
          this.map.getView().fit(this.uploadVectorSource.getExtent());
        }
      },
      modalState(newState){
        this.uploadVectorSource.clear();
      }
    }
  }
</script>

<style scoped>

</style>
