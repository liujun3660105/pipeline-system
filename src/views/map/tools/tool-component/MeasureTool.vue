<template>
  <div>
    <a @click="startMeasurement">地图测量<span class="iconfont">&#xe960;</span></a>
    <div class="measurementPane" v-show="showMeasurementPane">
      <RadioGroup class="radio" v-model="measurementType" vertical @on-change="raidoChange">
        <Radio label="LineMeasurement">
          <span>距离测量</span>
        </Radio>
        <Radio label="PolygonMeasurement">
          <span>面积测量</span>
        </Radio>
      </RadioGroup>
    </div>
  </div>
</template>

<script>
  import ready from '@/mixins/ready';
  import Overlay from 'ol/Overlay.js';
  import {getArea, getLength} from 'ol/sphere.js';
  import {LineString, Polygon} from 'ol/geom.js';
  import Draw from 'ol/interaction/Draw.js';
  import {Vector as VectorLayer} from 'ol/layer.js';
  import {Vector as VectorSource} from 'ol/source.js';
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
  import Projection from 'ol/proj/Projection';
  import {get} from 'ol/proj'
    export default {
        name: "MeasureTool",
      mixins: [ready],
      data(){
          return {
            showMeasurementPane:false,
            measurementType:'LineMeasurement',
            vectorSource:null,
            vectorLayer:null,
            draw:null,
            helpMsg:'点击鼠标进行画图操作',
            helpTooltipElement:null,
            helpTooltipOverlay:null,
            measureMsg:'',
            measureTooltipElement:null,
            measureTooltipOverlay:null,
            sketch:null
          }
      },
      computed:{
          //获得Draw的类型
          getDrawType(){
            return this.measurementType === 'LineMeasurement' ? 'LineString' : 'Polygon';
          }
      },
      methods:{
        _load: function () {
          this.vectorSource = new VectorSource();
          this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style: new Style({
              fill: new Fill({
                color: 'rgba(0, 0, 0, 0.2)'
              }),
              stroke: new Stroke({
                color: '#ffcc33',
                width: 2
              }),
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                  color: '#ffcc33'
                })
              })
            }),
            zIndex: 3

          });
          this.map.addLayer(this.vectorLayer);
        },
        /**
         * 点击测量工具.
         */
        startMeasurement(){
          this.showMeasurementPane=!this.showMeasurementPane;
          if(this.showMeasurementPane){
            //开启测量
            this.drawInteraction(this.getDrawType);
             this.map.on('pointermove', this.pointerMoveHandler);
          }
          else{
            //关闭测量
            this.map.removeOverlay(this.helpTooltipOverlay);
            this.map.removeOverlay(this.measureTooltipOverlay);
            this.map.removeInteraction(this.draw);
            this.vectorSource.clear();
          }
        },
        //开始启动画图工具
        drawInteraction(type) {
          this.vectorSource.clear();//清除上一次画的图形
          this.map.removeInteraction(this.draw);//关闭画图工具
          this.map.removeOverlay(this.helpTooltipOverlay);
          this.map.removeOverlay(this.measureTooltipOverlay);//移除帮助和测量显示的内容
          //启动画图工具
          this.draw = new Draw({
            source: this.vectorSource,
            type: type,
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
          this.map.addInteraction(this.draw);

          //创建帮助信息界面，并加载到地图上
          this.createHelpTooltip();
          //创建测量信息界面，并加载到地图上
          this.createMeasureTooltip();
          this.draw.on('drawstart',(evt)=>{
            //让测量显示初始化
            this.measureTooltipElement.className = 'tooltip tooltip-measure';
            this.sketch=evt.feature;
            var tooltipCoord = evt.coordinate;
            this.sketch.getGeometry().on('change', (evt)=>{
              var geom=evt.target;
              if(geom instanceof Polygon){
                this.helpMsg='继续点击鼠标画面，双击结束';
                this.measureMsg=this.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
              }
              else if(geom instanceof LineString){
                this.helpMsg='继续点击鼠标画线，双击结束';
                this.measureMsg=this.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
              }
              this.measureTooltipElement.innerHTML=this.measureMsg;
              this.measureTooltipOverlay.setPosition(tooltipCoord);

            });

            this.vectorSource.clear();
          });
          this.draw.on('drawend',(evt)=>{
            this.measureTooltipElement.className = 'tooltip tooltip-static';
            this.measureTooltipOverlay.setOffset([0, -7]);
            this.helpTooltipElement.innerHTML='点击鼠标进行画图操作';
            this.sketch=null

          });
        },
        /**
         * 鼠标已经点击下去开始画图时，鼠标在地图移动时的操作
         */
        pointerMoveHandler(e){
          if(this.sketch){
            var geom = (this.sketch.getGeometry());
            if (geom instanceof Polygon) {
              this.helpMsg = '继续点击鼠标画面，双击结束';
            } else if (geom instanceof LineString) {
              this.helpMsg = '继续点击鼠标画线，双击结束';
            }
          }
          else{
            this.helpMsg='点击鼠标进行画图操作'
          }
          this.helpTooltipElement.innerHTML =this.helpMsg;
          this.helpTooltipOverlay.setPosition(e.coordinate);

        },

        //测量长度和测量面积切换时
        /**
         * Message to show when the user is drawing a polygon.
         * @type {string}
         */
        raidoChange(data){
            this.drawInteraction(this.getDrawType);
        },

        //创建帮助信息窗口
        createHelpTooltip(){
          this.helpTooltipElement=document.createElement('div');
          this.helpTooltipElement.className = 'tooltip';
          this.helpTooltipOverlay = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
          });
          this.map.addOverlay(this.helpTooltipOverlay);
        },

        //创建测量结果信息窗口
        createMeasureTooltip() {
          this.measureTooltipElement = document.createElement('div');
          this.measureTooltipElement.className = 'tooltip tooltip-measure';
          this.measureTooltipOverlay = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltipOverlay);
  },

        //生成线的测量表示内容
        formatLength(line){
          // var sourceProj = this.map.getView().getProjection();
          // var sourceProj=new Projection('3857');
          let lineto4326=line.clone();
          let lineto3857=lineto4326.transform('EPSG:4326','EPSG:3857');
          // console.log(lineto3857);
          // var sourceProj=get('EPSG:3857');
          // var length = getLength(lineto3857,{
          //   projection:sourceProj
          // });
          var length=lineto3857.getLength();
          // var length=getLength(line,{
          //   projection:sourceProj
          // });
          var output;
          if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
              ' ' + 'km';
          } else {
            output = (Math.round(length * 100) / 100) +
              ' ' + 'm';
          }
          return output;
        },
        //生成面的测量表示内容
        formatArea(polygon) {
          // var sourceProj = this.map.getView().getProjection();
          // var area = getArea(polygon,{
          //   projection:sourceProj
          // });
          let polygon4326=polygon.clone();
          let polygon3857=polygon4326.transform('EPSG:4326','EPSG:3857');
          let area=polygon3857.getArea();
          var output;
          if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
          } else {
            output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
          }
          return output;
        }
      },
      watch:{
        // showMeasurementPane(newValue){
        //   if(newValue){
        //     var type =
        //     this.drawInteraction(type);
        //   }
        //   else{
        //     //撤销draw
        //     this.map.removeInteraction(this.draw);
        //
        //   }
        // }
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
  .measurementPane{
    position:absolute;
    width:110px;
    height:60px;
    background-color: rgba(0,0,0,0.5);
    border-radius:15px;

  }
  .measurementPane label, .measurementPane span{
    font-size:15px;
    color:white;
  }


</style>
