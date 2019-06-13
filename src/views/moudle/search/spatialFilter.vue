<template>
    <div></div>
</template>

<script>
  import ready from '@/mixins/ready';
  import Draw from 'ol/interaction/Draw.js';
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
  import Vector from 'ol/source/Vector'
  import VectorLayer from 'ol/layer/Vector'
  import WKT from 'ol/format/WKT'

    export default {
      name: "spatialFilter",
      mixins: [ready],
      data() {
        return {
          drawVectorSource: null,
          drawVectorLayer: null,
        }
      },
      methods: {
        _load() {
          console.log('spatialFilter');
          this.drawVectorSource = new Vector();
          this.drawVectorLayer = new VectorLayer({
            source: this.drawVectorSource,
            style: new Style({
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
            zIndex: 3
          });
          this.map.addLayer(this.drawVectorLayer);
        }
      },
      computed: {
        getDrawEnable() {
          return this.$store.state.search.isDraw
        }
      },
      watch: {
        getDrawEnable(newDrawEnable) {
          if (newDrawEnable) {
            this.drawVectorSource.clear();
            var draw = new Draw({
              source: this.drawVectorSource,
              type: 'Polygon',
              style: new Style({
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.5)',
                  lineDash: [10, 10],
                  width: 2
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
              })
            });
            draw.on('drawend',(evt)=>{

              this.map.removeInteraction(draw);
              this.$store.commit('isDrawChange',false);
              //把画的几何图形转换成WKT格式
              var wkt=new WKT();
              let geometryWKT=wkt.writeGeometryText(evt.feature.getGeometry());
              this.$store.commit('geometryChange',geometryWKT);

            });
            this.map.addInteraction(draw);
          }
        }
      }
    }
</script>

<style scoped>

</style>
