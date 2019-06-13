<template>
    <div>
      <PopupOverlay :position="position" :featureInfo="featureInfo" :layerType="layerType" :isShownAwait="isShownAwait" ></PopupOverlay>
    </div>
</template>
<script>
  import ready from '@/mixins/ready';
  import PopupOverlay from '@/components/map/PopupOverlay.vue'
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
  export default {
    name: "ShowFeaureInfo",
    mixins: [ready],
    data() {
      return {
        position:[],
        featureInfo:{},
        layerType:'',
        isShownAwait:true,
        clickFeature:null
      }
    },
    methods:{
      _load(){
        this.map.on('click',(e)=>{
          console.log(this.selectedVectorLayer);
          let features=this.map.getFeaturesAtPixel(e.pixel,{
            layerFilter:(layer)=>{
              return layer===this.selectedVectorLayer//从混合中传过来的
            },
            hitTolerance:5
          });
          console.log(features);
          if(features){
            this.showFeatureInfo(e,features[0])
          }
        });
      },
      showFeatureInfo(e,feature){
        let xmWmsLayer=this.themeLayers.filter(layerObject=>{
          return layerObject.value==='xm'
        })[0].layer;
        if(!xmWmsLayer.getVisible()){
          if(this.clickFeature){
            this.clickFeature.setStyle(null);
          }
          this.clickFeature=feature;
          this.position=e.coordinate;
          this.isShownAwait=true;//让每一次点击，都会显示等待
          this.featureInfo=this.clickFeature.getProperties();
          if(this.featureInfo){
            this.isShownAwait=false;
          }
          this.layerType='xm';
          let style=new Style({
            stroke: new Stroke({
              color: 'rgba(0, 206, 209, 0.9)',
              lineDash: [10, 10],
              width: 5
            }),
          });
          this.clickFeature.setStyle(style);
        }

      }
    },
    components:{
      PopupOverlay
    }
  }
</script>

<style scoped>

</style>
