<template>
  <div>
    <div v-if="isShownAwait" class="await">
      <Spin>
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      </Spin>
    </div>
    <div v-else class="popup-overlay" >
      <div class="popup-overlay-arrow"></div>
      <div class="popup-overlay-header">
        <div class="popup-overlay-header-title">
          <span>
            {{this.overlayTitle}}
          </span>
          <a class="popup-overlay-header-closer" @click="_handleClose"></a>
        </div>


      </div>
      <div class="popup-overlay-content">
        <div v-if="Object.keys(featureInfo).length===0">
          {{getShownObject}}
        </div>
        <div v-else>
          <ul>
            <li v-for="(value,key,index) in getShownObject" :key="index">
              <span>{{key}}:</span>
              <span>{{value}}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>

  </div>

</template>

<script>
  import Overlay from 'ol/Overlay.js';
  import ready from '@/mixins/ready';
    export default {
        name: "PopupOverlay",
      data(){
          return {
            overlay:null,
            featureStructure:{},
            overlayTitle:'',
            showLayerList:['pc','dh','sy','wt','xm','kg','tg']
          }
      },
      computed:{
          getShownObject(){
            if(Object.keys(this.featureInfo).length!==0){
              var featureShownInfo={};
              Object.keys(this.featureStructure).map((key,item)=>{
                featureShownInfo[this.featureStructure[key]]=this.featureInfo[key]
              })
              return featureShownInfo
            }
            else{
              return '无数据'
            }

          },
          getPositionandLayerType(){
            let object={
              position:this.position,
              layerType:this.layerType
            };
            return object;
          }
      },
      props:{
          position:{
            type:Array,
            required: true
          },
        featureInfo:{
            type:Object,
          required: true,
          default:{}
        },
        layerType:{
            type:String,
            required:true

        },
        isShownAwait:{
            type:Boolean,
            default:true
        }//当鼠标点击地图时，先出现等待界面，直到获取数据（异步执行完毕后），才弹出信息框

      },
      mixins: [ready],
      methods:{
          _load(){
            this.overlay=new Overlay({
              element:this.$el,
              autoPan: true,
              autoPanAnimation: {
                duration: 250
              },
              position:this._getPosition(this.position),
              autoPanMargin:200
            });
            this.map.addOverlay(this.overlay);

          },
        _getPosition (position ){
            //如果所点击的图层不在layerType中，则不显示popup
            if(position.length===0){
              position=undefined
            }
            return position
        },
        _handleClose () {
          this.overlay.setPosition(undefined);
          return false;
        }
      },
      watch:{
          //当点击图层的类型在showLayerList中，则显示popup，否则不显示popup
        //同时监听两个变量
          getPositionandLayerType(newObject){
            if(this.showLayerList.includes(newObject.layerType)){
              this.overlay.setPosition(this._getPosition(newObject.position));
            }
            else{
              this._handleClose();
            }
          },
          // position(newPosition){
          //
          //   if(newPosition.length){
          //     if(this.overlay){
          //       this.overlay.setPosition(this._getPosition(newPosition));
          //     }
          //     else{
          //       this._load();
          //     }
          //   }
          //   else{
          //     this._handleClose();
          //   }
          // },
        //当layerType发生变化时，调整显示的数据结构
        layerType(newValue){
            if(newValue){
              if(this.showLayerList.includes(newValue)){
                switch (newValue){
                  case 'pc':
                    this.featureStructure={
                      'qsdh':'起始点号',
                      'zzdh':'终止点号',
                      'qsms':'起始埋深',
                      'zzms':'终止埋深',
                      'qsgugc':'起始管顶高程',
                      'zzgugc':'终止管顶高程',
                      'qsgdgc':'起始管底高程',
                      'zzgdgc':'终止管底高程',
                      'gxcl':'管线材料',
                      'msfs':'埋设方式',
                      'gj':'管径',
                      'jsrq':'建设日期',
                      'qsdw':'权属单位',
                      'dlts':'电缆条数',
                      'glts':'光缆条数',
                      'ylz':'压力值',
                      'zks':'总孔数',
                      'yyks':'已用孔数',
                      'kcdw':'勘测单位',
                      'gxdl':'管线大类',
                      'gxdldm':'管线大类代码',
                      'gxyjlb':'管线亚级类别',
                      'gxyjlbdm':'管线亚级类别代码',
                      'gxsyzk':'管线使用状况',
                      'xbzdm':'线标准代码',
                      'lx':'流向',
                      'ly':'来源',
                      'bz':'备注'
                    };
                    this.overlayTitle='普查数据';
                    break;
                  case 'dh':
                    this.featureStructure={
                      'qsdh':'起始点号',
                      'zzdh':'终止点号',
                      'qsms':'起始埋深',
                      'zzms':'终止埋深',
                      'qsgugc':'起始管顶高程',
                      'zzgugc':'终止管顶高程',
                      'qsgdgc':'起始管底高程',
                      'zzgdgc':'终止管底高程',
                      'gxcl':'管线材料',
                      'msfs':'埋设方式',
                      'gj':'管径',
                      'jsrq':'建设日期',
                      'qsdw':'权属单位',
                      'dlts':'电缆条数',
                      'glts':'光缆条数',
                      'ylz':'压力值',
                      'zks':'总孔数',
                      'yyks':'已用孔数',
                      'kcdw':'勘测单位',
                      'gxdl':'管线大类',
                      'gxdldm':'管线大类代码',
                      'gxyjlb':'管线亚级类别',
                      'gxyjlbdm':'管线亚级类别代码',
                      'gxsyzk':'管线使用状况',
                      'xbzdm':'线标准代码',
                      'lx':'流向',
                      'ly':'来源',
                      'bz':'备注'
                    };
                    this.overlayTitle='调绘数据';
                    break;
                  case 'sy':
                    this.featureStructure={
                      'qsdh':'起始点号',
                      'zzdh':'终止点号',
                      'qsms':'起始埋深',
                      'zzms':'终止埋深',
                      'qsgugc':'起始管顶高程',
                      'zzgugc':'终止管顶高程',
                      'qsgdgc':'起始管底高程',
                      'zzgdgc':'终止管底高程',
                      'gxcl':'管线材料',
                      'msfs':'埋设方式',
                      'gj':'管径',
                      'jsrq':'建设日期',
                      'qsdw':'权属单位',
                      'dlts':'电缆条数',
                      'glts':'光缆条数',
                      'ylz':'压力值',
                      'zks':'总孔数',
                      'yyks':'已用孔数',
                      'kcdw':'勘测单位',
                      'gxdl':'管线大类',
                      'gxdldm':'管线大类代码',
                      'gxyjlb':'管线亚级类别',
                      'gxyjlbdm':'管线亚级类别代码',
                      'gxsyzk':'管线使用状况',
                      'xbzdm':'线标准代码',
                      'lx':'流向',
                      'ly':'来源',
                      'bz':'备注'
                    };
                    this.overlayTitle='示意数据';
                    break;
                  case 'wt':
                    this.featureStructure={
                      'qsdh':'起始点号',
                      'zzdh':'终止点号',
                      'qsms':'起始埋深',
                      'zzms':'终止埋深',
                      'qsgugc':'起始管顶高程',
                      'zzgugc':'终止管顶高程',
                      'qsgdgc':'起始管底高程',
                      'zzgdgc':'终止管底高程',
                      'gxcl':'管线材料',
                      'msfs':'埋设方式',
                      'gj':'管径',
                      'jsrq':'建设日期',
                      'qsdw':'权属单位',
                      'dlts':'电缆条数',
                      'glts':'光缆条数',
                      'ylz':'压力值',
                      'zks':'总孔数',
                      'yyks':'已用孔数',
                      'kcdw':'勘测单位',
                      'gxdl':'管线大类',
                      'gxdldm':'管线大类代码',
                      'gxyjlb':'管线亚级类别',
                      'gxyjlbdm':'管线亚级类别代码',
                      'gxsyzk':'管线使用状况',
                      'xbzdm':'线标准代码',
                      'lx':'流向',
                      'xmbm':'项目编码',
                      'ly':'来源',
                      'bz':'备注'
                    };
                    this.overlayTitle='物探数据';
                    break;
                  case 'xm':
                    this.featureStructure={
                      'gxcl':'管线材料',
                      'msfs':'埋设方式',
                      'gj':'管径',
                      'dlts':'电缆条数',
                      'glts':'光缆条数',
                      'ylz':'压力值',
                      'zks':'总孔数',
                      'yyks':'已用孔数',
                      'gxdl':'管线大类',
                      'gxdldm':'管线大类代码',
                      'gxyjlb':'管线亚级类别',
                      'gxyjlbdm':'管线亚级类别代码',
                      'xmbm':'项目编码',
                      'ly':'来源',
                      'bz':'备注'
                    };
                    this.overlayTitle='规划数据';
                    break;
                  case 'kg':
                    this.featureStructure={
                      'pqmc':'片区名称',
                      'fqmc':'分区名称',
                      'dybh':'单元编号',
                      'dkbh':'地块编号',
                      'yddm':'用地代码',
                      'ydxz':'用地性质',
                      'ydmj':'用地面积',
                      'rjl':'容积率',
                      'jzmd':'建筑密度',
                      'ldl':'绿地率',
                      'jzxg':'建筑限高',
                      'ssmc':'设施名称',
                      'jsgm':'设施规模',
                      'tzrq':'调整日期',
                      'bz':'备注'
                    };
                    this.overlayTitle='控规';
                    break;
                  case 'tg':
                    this.featureStructure={
                      'ghdm':'规划代码',
                      'ghdl':'规划地类'
                    };
                    this.overlayTitle='土规';
                    break;
                }
              }
              else{
                this._handleClose ();
              }

            }
        }
      }
    }
</script>

<style scoped>
  .popup-overlay{
    position: absolute;
    top: -20px;
    left: 10px;
    width:300px;
    height:250px;
    background-color:rgba(0,0,0,0.5);
    border-radius: 10px;
    font-size:15px;
    color:white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));

  }
  .popup-overlay-arrow{
    position: absolute;
    top: 10px;
    left: -16px;
    border: 8px solid transparent;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
    border-right-color:rgba(0, 0, 0,0.5);
  }
  .popup-overlay-header{
    height:50px;
    border-bottom:solid 1px white;
  }
  .popup-overlay-header-title span{
    position:absolute;
    top:10px;
    left:10px;
  }

  .popup-overlay-header-title{
  }
  .popup-overlay-header-closer:after{
    content:'✖';
    color:white;
  }
  .popup-overlay-header-closer{
    position:absolute;
    top:10px;
    right:10px;
  }
  /*.popup-overlay-content ul li:nth-of-type(odd){*/
 /*background:#00ccff;*/

  /*}*/
  .popup-overlay-content{
    overflow: auto;
    height:200px;
  }
  .popup-overlay-content::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .popup-overlay-content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
  }
  .popup-overlay-content::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
  }
  .popup-overlay-content ul li{
    list-style: none;
  }
  .popup-overlay-content ul li:nth-of-type(even){
  background:rgba(69,73,74,0.8);
  }
  .popup-overlay-content ul li span{
    display:inline-block;
    width:49%;
    padding-left:10px;
  }

  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
    color:rgba(0,0,0,0.8)
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }

</style>
