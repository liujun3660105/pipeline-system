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
import { mapState, mapMutations } from "vuex";
export default {
  name: "DrawGeometry",
  mixins: [ready],
  data() {
    return {
      drawVectorSource: null,
      drawVectorLayer: null,
      draw: null
    };
  },
  methods: {
    _load() {
      this.drawVectorSource = new Vector();
      this.drawVectorLayer = new VectorLayer({
        source: this.drawVectorSource,
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.5)",
            lineDash: [10, 10],
            width: 5
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
        zIndex: 10
      });
      this.map.addLayer(this.drawVectorLayer);

    },
    ...mapMutations("draw", ["isDrawChange", "isDrawShownChange"]),
    ...mapMutations([
      "statisticGeometryChange",
      "searchGeometryChange",
      "distanceGeometryChange"
    ])
  },
  computed: {
    ...mapState("draw", ["isDraw", "moduleType", "isDrawShown"])
    // getDrawEnable() {
    //   return this.$store.state.search.isDraw
    // }
  },
  watch: {
    isDraw(newDrawEnable) {
      if (newDrawEnable) {
      this.draw = new Draw({
        source: this.drawVectorSource,
        type: "Polygon",
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.5)",
            lineDash: [10, 10],
            width: 2
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
        })
      });
        this.isDrawShownChange(true); //默认开启geometry显示
        this.drawVectorSource.clear();
        this.draw.on("drawend", evt => {
          this.map.removeInteraction(this.draw);
          //把画的几何图形转换成WKT格式
          let wkt = new WKT();
          let geometryWKT = wkt.writeGeometryText(
            evt.feature.getGeometry().transform("EPSG:3857", "EPSG:4326")
          );
          // this.$store.commit('geometryChange',geometryWKT);
          //从draw.js传过来的值 来判断是哪个模块调用画图供能
          if (this.moduleType === "search") {
            this.searchGeometryChange(geometryWKT);
          }
          if (this.moduleType === "statistic") {
            this.statisticGeometryChange(geometryWKT);
          }
          if (this.moduleType === "distance") {
            this.distanceGeometryChange(geometryWKT);
          }
          // this.$store.commit('isDrawChange',false);
          this.isDrawChange(false);
        });
        this.map.addInteraction(this.draw);
      } else {
        this.map.removeInteraction(this.draw);
      }
    },
    isDrawShown(newDrawShownEnable) {
      if (!newDrawShownEnable) {
        this.drawVectorSource.clear();
      }
    }
  }
};
</script>

<style scoped>
</style>
