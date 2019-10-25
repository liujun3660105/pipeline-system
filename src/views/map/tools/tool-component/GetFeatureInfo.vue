<template>
  <div>
    <a @click="isGetFeatureInfo=!isGetFeatureInfo">要素查看<Icon type="ios-information-circle" size="25" :class="{active:isGetFeatureInfo}"></Icon></a>
    <PopupOverlay :position="position" :featureInfo="featureInfo" :layerType="layerType" :isShownAwait="isShownAwait" ></PopupOverlay>
  </div>

</template>

<script>
  import TileWMS from 'ol/source/TileWMS'
  import PopupOverlay from '@/components/map/PopupOverlay.vue'
  import ready from '@/mixins/ready';
    export default {
        name: "HomeView",
      data(){
          return {
            isGetFeatureInfo:false,
            overlay:null,
            position:[],
            featureInfo:{},
            PromiseTimes:0,
            layerIndex:-1,
            layerType:'',
            isShownAwait:true
          }

      },
      mixins: [ready],
      methods:{
          _load(){

          },
        //鼠标点击后，显示点击要素的信息
        showFeatureInfo(e){
          this.position=e.coordinate;
          //获得地图上显示的专题图层
          var wmsShownLayers=this.getShownWMSLayer();
          //初始化PromiseTimes
          this.PromiseTimes=0;
          this.isShownAwait=true;//让每一次点击，都会显示等待
          this.setLayerIndex(wmsShownLayers,e);
        },
        //得到地图上显示的wms专题图层列表
        //20190529测试普查数据量大，getFeagureInfoUrl耗时较长，所以在Map.vue中，将普查数据放在最后，当点击别的图层时，如果查到要素，不会继续遍历剩余图层，减少耗时
        getShownWMSLayer(){
          var wmsLayerList=this.map.getLayers();
          var searchLayerList=[];
          wmsLayerList.getArray().forEach((wmsLayer,index)=>{
            //wms服务有可能是imagewms或者tilewms，不同的source，得到url的方法是不一样的，这里分别进行判断
              if(wmsLayer.type==='TILE'){
                //通过调试发现地形图的source的url为null,所以getUrls()[0]方法不适用，会报错
                let url = wmsLayer.getSource().urls instanceof Array ? wmsLayer.getSource().urls[0] : '';
                if(url.search("wms")>0&&wmsLayer.getVisible()){
                  searchLayerList.push(wmsLayer)
                }
              }
              if(wmsLayer.type==='IMAGE'){
                if(wmsLayer.getSource().getUrl().search("wms")>0&&wmsLayer.getVisible()){
                  searchLayerList.push(wmsLayer)
                }
              }
            }
          );
          return searchLayerList.reverse()//这里数组顺序颠倒，让最上面的图层先进行遍历
        },
        //Promise+递归 实现对多个专题图层的遍历，当搜索到数据后，就立即停止遍历
        setLayerIndex(layers,e){
            if(this.PromiseTimes<layers.length){
              let url=layers[this.PromiseTimes].getSource().getGetFeatureInfoUrl(e.coordinate, this.view.getResolution(), "EPSG:4326",{
                INFO_FORMAT:'application/json'
              });
                this.$axios.get(url).then((data)=>{
                  if(data.data.features.length){
                    this.isShownAwait=false;//当搜索到要素的时候，异步结束，等待界面消失，显示信息框
                    this.featureInfo=data.data.features[0].properties;
                    var layerIndex=this.themeLayers.findIndex((val,index)=>{
                      return val.layer===layers[this.PromiseTimes]
                    });
                    this.layerType=this.themeLayers[layerIndex].value;
                  }
                  else{
                    this.featureInfo={};
                    this.PromiseTimes++;
                    this.setLayerIndex(layers,e);
                  }
                })

            }
            else{
              this.isShownAwait=false;//当最后没有搜索到任何要素的时候，显示信息框
            }

        }
      },


      watch:{
          isGetFeatureInfo(newValue){
            if(newValue){
              this.map.getTargetElement().style.cursor='help';
              this.map.addEventListener('click',this.showFeatureInfo);
            }
            else{
              this.map.getTargetElement().style.cursor='auto';
              this.map.removeEventListener('click',this.showFeatureInfo);
              //这里用removeEventListener之后，再次用on绑定this.map.on('click',this.showFeatureInfo)不起作用，所以绑定事件用了
              //addEventListener,隐患是 如果其他地方也用了on给map绑定事件，是否也会不起作用
            }
          }
      },
      components:{
        PopupOverlay
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

</style>
