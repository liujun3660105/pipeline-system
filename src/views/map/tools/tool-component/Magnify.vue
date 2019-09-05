<template>
    <div class="div-spy">
      <a @click="showMagnify">局部穿透<span class="iconfont" :class="{active:Enable}">&#xe683;</span></a>
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
            Enable:false

          }
      },
      methods:{
        _load(){

        },
        showMagnify(){

          this.Enable=!this.Enable;
        },
        mousemoveEvent(e){
          this.mousePosition = this.map.getEventPixel(e);
          console.log(this.mousePosition);
          this.map.render(this.mousePosition);
        }
      },
      watch:{
        Enable(newBoolean){
          if(newBoolean){
            this.radius=75;
            this.target=this.map.getTargetElement();
            this.googleRaterSource=new XYZ({
              crossOrigin:'anonymous',
              url:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
            });//google source
            this.imageLayer=new TileLayer({
              source:this.googleRaterSource
            });
            this.map.addLayer(this.imageLayer);
            this.target.addEventListener('mousemove', this.mousemoveEvent);
            this.target.addEventListener('mouseout', ()=> {
              this.mousePosition = null;
              this.map.render();
            });
            document.addEventListener('keydown', (evt)=> {
              if (evt.which === 38) {
                this.radius = Math.min(this.radius + 5, 150);
                this.map.render();
                evt.preventDefault();
              } else if (evt.which === 40) {
                this.radius = Math.max(this.radius - 5, 25);
                this.map.render();
                evt.preventDefault();
              }
            });
            // before rendering the layer, do some clipping
            this.imageLayer.on('precompose', (event)=> {

              var ctx = event.context;
              var pixelRatio = event.frameState.pixelRatio;
              ctx.save();
              ctx.beginPath();
              if (this.mousePosition) {
                // only show a circle around the mouse
                ctx.arc(this.mousePosition[0] * pixelRatio, this.mousePosition[1] * pixelRatio,
                  this.radius * pixelRatio, 0, 2 * Math.PI);
                ctx.lineWidth = 5 * pixelRatio;
                ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                ctx.stroke();
              }
              ctx.clip();
            });
            // after rendering the layer, restore the canvas context
            this.imageLayer.on('postcompose', function(event) {
              var ctx = event.context;
              ctx.restore();
            });
          }
          else{
            this.mousePosition=null;
            this.target.removeEventListener('mousemove',this.mousemoveEvent);
            this.map.removeLayer(this.imageLayer);
          }
        }
      }
    }
</script>

<style scoped>
  .tools-ul li a{
    color:white;
    font-size:15px;
  }
  .active{
    color:#2db6fb;
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
