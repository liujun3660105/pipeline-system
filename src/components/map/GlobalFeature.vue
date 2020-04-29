<template>
  <div></div>
</template>
<script>
import ready from "@/mixins/ready";
import Draw from "ol/interaction/Draw.js";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import Vector from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import WKT from "ol/format/WKT";
import GeoJSON from "ol/format/GeoJSON";
import GeometryCollection from "ol/geom/GeometryCollection";
import { mapState } from "vuex";
import featureTransform from "@/util/featureTransform";

export default {
  name: "GlobalFeature",
  mixins: [ready],
  data() {
    return {
      globalVectorLayer: null,
      globalVectorSource: null,
      globalSelectedFeatures: []
    };
  },
  methods: {
    _load() {
      //设置筛选出的要素相关图层和源
      this.globalVectorSource = new Vector();
      this.globalVectorLayer = new VectorLayer({
        source: this.globalVectorSource,
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
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 0, 0, 0.4)"
          }),
          stroke: new Stroke({
            color: "rgba(255, 0, 0, 1)",
            // lineDash: [10, 10],
            width: 4
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: "rgba(0, 0, 0, 0.7)"
            }),
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)"
            })
          })
        }),
        zIndex: 3
      });
      // this.$store.commit("selectLayerChange", this.globalVectorLayer);
      this.map.addLayer(this.globalVectorLayer);
    }
  },
  computed: {
    ...mapState("modal", ["modalState"]),
    ...mapState("globalFeature",["globalFeatures","DbClickRow"]),
    // getSelectedFeatures() {
      // return this.$store.state.search.features;
      //从后端传来的数据成果有两种形式，一种是geojson数据，一种是json数据，对应后台的sql语句
      //注释部分为json部分，但是feature和properities是分离的，对于后期不好实现点击查看要素信息,所以利用的是geojson数据
      // let selectedGeoms=[];
      // selectedFeatures.forEach((feature,index)=>{
      //   console.log(JSON.parse(feature.geom));
      //   selectedGeoms.push(JSON.parse(feature.geom).coordinates);
      // });
    // },
    // getDbClickRowXmId() {
    //   return this.$store.state.search.DbClickRowXmId;
    // }
  },
  watch: {
    //点击工具栏清除要素，进行清除
    modalState(newState){
      this.globalVectorSource.clear();
    },
    //异步获取xmline表的要素数据，更改vuex中search模块的features
    globalFeatures(newFeatureList) {
      console.log('newFeatureList',newFeatureList)
      this.globalVectorSource.clear();
      if (newFeatureList.features || newFeatureList.geometries) {
        //如果查询的结果不为空，则进行要素显示和定位
        //collide中如果上传的文件时火星坐标系，则不需要数据库进行转换，直接读取shp文件的geojson，格式为{"type":"FeatureCollection","geometries:[{"type":"LineString","coor"}]"}
        let features = new GeoJSON().readFeatures(newFeatureList);
        this.globalVectorSource.addFeatures(
          featureTransform(features, "EPSG:4326", "EPSG:3857")
        );
        this.map.getView().fit(this.globalVectorSource.getExtent());
      }
    },
    //双击表格某一行，得到这一行数据的项目编号
    DbClickRow(newXmId) {
      console.log('新的',newXmId);
      this.globalSelectedFeatures.forEach(feature => {
        feature.setStyle(null);
      });
      this.globalSelectedFeatures = this.globalVectorSource
        .getFeatures()
        .filter(feature => {
          return feature.getProperties().xmbm === newXmId;
        });
      // if (this.globalSelectedFeatures.length === 0) {
      //   this.$Message.warning({
      //     content: "目前所选项目的管线信息还未入库！",
      //     duration: 1.5
      //   });
      //   return;
      // }
      let style = new Style({
        stroke: new Stroke({
          color: "rgba(0, 255, 255, 0.9)",
          // lineDash: [10, 10],
          width: 4
        })
      });
      let geometries = [];
      this.globalSelectedFeatures.forEach(feature => {
        geometries.push(feature.getGeometry());
        feature.setStyle(style);
      });
      //缩放到要素
      let geometryCollection = new GeometryCollection(geometries);
      this.map.getView().fit(geometryCollection.getExtent());
      //缩放到双击的要素，后来觉得用户体验不好，取消
    }
  }
};
</script>

<style scoped>
</style>
