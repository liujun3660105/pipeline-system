<template>
    <div>
      <a @click="showMagnify">局部放大<span class="iconfont">&#xe683;</span></a>
    </div>
</template>
<script>
  import ready from '@/mixins/ready';
  import TileLayer from 'ol/layer/Tile';
  import XYZ from 'ol/source/XYZ';
  import BingMaps from 'ol/source/BingMaps.js';
    export default {
      name: "Magnify",
      mixins:[ready],
      data(){
          return {
            radius:75,
            target:null,
            googleRaterSource:null,
            imageLayer:null,
            mousePosition:null,
            imagery:null
          }
      },
      methods:{
        _load(){
            this.target=this.map.getTargetElement();
          var key = 'Your Bing Maps Key from http://www.bingmapsportal.com/ here';
          this.imagery = new TileLayer({
            source: new BingMaps({key: key, imagerySet: 'Aerial'})
          });

            this.googleRaterSource=new XYZ({
              crossOrigin:'anonymous',
              url:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
            });//google source
            this.imageLayer=new TileLayer({
              source:this.googleRaterSource
            });
            // this.map.addLayer(this.imageLayer);
          },
        showMagnify(){
          this.target.addEventListener('mousemove', (event)=> {
            this.mousePosition = this.map.getEventPixel(event);
            this.map.render();
          });

          this.target.addEventListener('mouseout', ()=> {
            this.mousePosition = null;
            this.map.render();
          });
          this.imageLayer.on('postcompose', (event)=> {
              if (this.mousePosition) {
                var context = event.context;
                var pixelRatio = event.frameState.pixelRatio;
                var half = this.radius * pixelRatio;
                var centerX = this.mousePosition[0] * pixelRatio;
                var centerY = this.mousePosition[1] * pixelRatio;
                var originX = centerX - half;
                var originY = centerY - half;
                var size = 2 * half + 1;
                var sourceData;
                var dest;
                var img = new Image();
                img.crossOrigin = '';
                img.onload = function () {
                  sourceData = context.getImageData(originX, originY, size, size).data;
                  dest = context.createImageData(size, size);
                  var destData = dest.data;
                  for (var j = 0; j < size; ++j) {
                    for (var i = 0; i < size; ++i) {
                      var dI = i - half;
                      var dJ = j - half;
                      var dist = Math.sqrt(dI * dI + dJ * dJ);
                      var sourceI = i;
                      var sourceJ = j;
                      if (dist < half) {
                        sourceI = Math.round(half + dI / 2);
                        sourceJ = Math.round(half + dJ / 2);
                      }
                      var destOffset = (j * size + i) * 4;
                      var sourceOffset = (sourceJ * size + sourceI) * 4;
                      destData[destOffset] = sourceData[sourceOffset];
                      destData[destOffset + 1] = sourceData[sourceOffset + 1];
                      destData[destOffset + 2] = sourceData[sourceOffset + 2];
                      destData[destOffset + 3] = sourceData[sourceOffset + 3];
                    }
                  }
                  context.beginPath();
                  context.arc(centerX, centerY, half, 0, 2 * Math.PI);
                  context.lineWidth = 3 * pixelRatio;
                  context.strokeStyle = 'rgba(255,255,255,0.5)';
                  context.putImageData(dest, originX, originY);
                  context.stroke();
                  context.restore();
                }
                img.src=require('../../../../assets/logo.png');
                // var sourceData = context.getImageData(originX, originY, size, size).data;
                // sourceData.crossOrigin ='';
                // var dest = context.createImageData(size, size);
                // var destData = dest.data;
                // for (var j = 0; j < size; ++j) {
                //   for (var i = 0; i < size; ++i) {
                //     var dI = i - half;
                //     var dJ = j - half;
                //     var dist = Math.sqrt(dI * dI + dJ * dJ);
                //     var sourceI = i;
                //     var sourceJ = j;
                //     if (dist < half) {
                //       sourceI = Math.round(half + dI / 2);
                //       sourceJ = Math.round(half + dJ / 2);
                //     }
                //     var destOffset = (j * size + i) * 4;
                //     var sourceOffset = (sourceJ * size + sourceI) * 4;
                //     destData[destOffset] = sourceData[sourceOffset];
                //     destData[destOffset + 1] = sourceData[sourceOffset + 1];
                //     destData[destOffset + 2] = sourceData[sourceOffset + 2];
                //     destData[destOffset + 3] = sourceData[sourceOffset + 3];
                //   }
                // }
                // context.beginPath();
                // context.arc(centerX, centerY, half, 0, 2 * Math.PI);
                // context.lineWidth = 3 * pixelRatio;
                // context.strokeStyle = 'rgba(255,255,255,0.5)';
                // context.putImageData(dest, originX, originY);
                // context.stroke();
                // context.restore();
              }
            });
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
