<template>
    <div></div>
</template>
<script>
  import ready from '@/mixins/ready'
  import Draw from 'ol/interaction/Draw.js'
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js'
  import Vector from 'ol/source/Vector'
  import VectorLayer from 'ol/layer/Vector'
  import WKT from 'ol/format/WKT'
  import GeoJSON from 'ol/format/GeoJSON'
  import GeometryCollection from 'ol/geom/GeometryCollection'

  export default {
      name: "SelectFeature",
      mixins: [ready],
      data() {
        return {
          selectedVectorLayer:null,
          selectedVectorSource:null,
          selectedFeatures:[]
        }
      },
      methods: {
        _load() {
          //设置筛选出的要素相关图层和源
          this.selectedVectorSource=new Vector();
          this.selectedVectorLayer=new VectorLayer({
            source:this.selectedVectorSource,
            // new Vector({
            // features:features
            //这里features是数组
            // features:[new Feature({
            //   geometry:new MultiLineString(this.getSelectedFeatures)
            // })]
            // features:new Collection({
            //   array:new MultiLineString(this.getSelectedFeatures)
            // })
            // }),
            style:new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new Stroke({
                color: 'rgba(255, 0, 0, 0.9)',
                // lineDash: [10, 10],
                width: 4
              }),
              image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)'
                })
              })
            }),
            zIndex:3
          });
          this.$store.commit('selectLayerChange',this.selectedVectorLayer);
          this.map.addLayer(this.selectedVectorLayer);
        },
      },
      computed: {
        getSelectedFeatures(){
          return this.$store.state.search.features
          //从后端传来的数据成果有两种形式，一种是geojson数据，一种是json数据，对应后台的sql语句
          //注释部分为json部分，但是feature和properities是分离的，对于后期不好实现点击查看要素信息,所以利用的是geojson数据
          // let selectedGeoms=[];
          // selectedFeatures.forEach((feature,index)=>{
          //   console.log(JSON.parse(feature.geom));
          //   selectedGeoms.push(JSON.parse(feature.geom).coordinates);
          // });
        },
        getDbClickRowXmId(){
          return this.$store.state.search.DbClickRowXmId;
        }
      },
      watch: {
        //异步获取xmline表的要素数据，更改vuex中search模块的features
        getSelectedFeatures(newFeatureList){
          console.log(newFeatureList);
          this.selectedVectorSource.clear();
          if(newFeatureList.features||newFeatureList.geometries){//如果查询的结果不为空，则进行要素显示和定位
            //collide中如果上传的文件时火星坐标系，则不需要数据库进行转换，直接读取shp文件的geojson，格式为{"type":"FeatureCollection","geometries:[{"type":"LineString","coor"}]"}
            let selectedFeatures=new GeoJSON().readFeatures(newFeatureList);
            this.selectedVectorSource.addFeatures(selectedFeatures);
            this.map.getView().fit(this.selectedVectorSource.getExtent());
          }
        },
        //双击表格某一行，得到这一行数据的项目编号
        getDbClickRowXmId(newXmId){
          this.selectedFeatures.forEach(feature=>{
            feature.setStyle(null);
          });
          this.selectedFeatures=this.selectedVectorSource.getFeatures().filter(feature=>{
            return feature.getProperties().xmbm===newXmId
          });
          let style=new Style({
            stroke: new Stroke({
              color: 'rgba(0, 255, 255, 0.9)',
              // lineDash: [10, 10],
              width: 4
            }),
          });
          let geometries=[];
          this.selectedFeatures.forEach(feature=>{
            geometries.push(feature.getGeometry());
            feature.setStyle(style);
          });
          console.log(this.selectedFeatures);
          let geometryCollection=new GeometryCollection(geometries);
          this.map.getView().fit(geometryCollection.getExtent());
        }
      }
    }
</script>

<style scoped>

</style>
