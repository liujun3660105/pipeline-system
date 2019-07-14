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
      name: "spatialFilter",
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
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 5
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
          this.$store.commit('selectLayerChange',this.selectedVectorLayer)
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
          this.selectedVectorSource.clear();
          if(newFeatureList.features){//如果查询的结果不为空，则进行要素显示和定位
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
              color: 'rgba(220, 20, 60, 0.9)',
              lineDash: [10, 10],
              width: 5
            }),
          });
          let geometries=[];
          this.selectedFeatures.forEach(feature=>{
            geometries.push(feature.getGeometry());
            feature.setStyle(style);
          });
          let geometryCollection=new GeometryCollection(geometries);
          this.map.getView().fit(geometryCollection.getExtent());
        }
      }
    }
</script>

<style scoped>

</style>
