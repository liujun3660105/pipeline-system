<template>
  <div class="collide">
    <Loading :spinShown="spinShown"></Loading>
    <Row :gutter="0" class="item-row">
      <i-col span="8" class="gxinfo-col">
        <span class="gxinfo-title">请选择管线类别</span>
        <Cascader :data="gxinfoList" trigger="hover" v-model="gxinfo" :disabled="gxTypeEnable"></Cascader>
      </i-col>
      <i-col span="8" class="gxinfo-col">
        <span class="gxinfo-title">请输入管径(mm)</span>
        <InputNumber :step="100" :min="0" v-model="gj" :editable="false" :disabled="gxTypeEnable"></InputNumber>
      </i-col>
      <i-col span="8" class="gxinfo-col">
        <Button :disabled="analyzeEnable" icon="logo-steam" @click="startDrawGeom">框选范围分析</Button>
      </i-col>
    </Row>
    <!--<Row :gutter="0" class="item-row">-->
    <!--<Table  @on-row-dblclick="selectRow" class="info-table"  height="200" :columns="gxInfoColumns" :data="gxInfoData"/>-->
    <!--</Row>-->
  </div>
</template>
<script>
import { getUploadGeometry, getAnalyzeGeometry } from "@/api/collide";
import { mapState, mapMutations } from "vuex";
import { getPolygonbydraw } from "@/api/distance";
import WKT from "ol/format/WKT";
import GeoJSON from "ol/format/GeoJSON";
export default {
  name: "Collide",
  data() {
    return {
      // gxInfoColumns: [
      //   {
      //     title: '编号',
      //     key: 'xmbm',
      //     width:150,
      //     align:'center'
      //   },
      //   {
      //     title: '冲突管线编号',
      //     key: 'conflictid',
      //     width:150,
      //     tooltip:true,
      //     align:'center'
      //   },
      //   {
      //     title: '冲突管线类型',
      //     key: 'zy',
      //     width:190,
      //     align:'center'
      //   },
      //   {
      //     title: '冲突管线长度',
      //     key: 'length',
      //     width:200,
      //     align:'center'
      //   }
      // ],
      // gxInfoData: [
      // ],
      gxinfoList: [
        { value: "JS", label: "给水" },
        { value: "PS", label: "排水" },
        { value: "ZS", label: "中水" },
        {
          value: "RQ",
          label: "燃气",
          children: [
            {
              value: "低压",
              label: "低压"
            },
            {
              value: "中压",
              label: "中压"
            },
            {
              value: "次高压",
              label: "次高压"
            }
          ]
        },
        { value: "RL", label: "热力" },
        {
          value: "DL",
          label: "电力",
          children: [
            {
              value: "<35kV",
              label: "<35kV",
              children: [
                { value: "直埋", label: "直埋" },
                { value: "其它", label: "其它" }
              ]
            },
            {
              value: ">=35kV",
              label: ">=35kV",
              children: [
                { value: "直埋", label: "直埋" },
                { value: "其它", label: "其它" }
              ]
            }
          ]
        },
        {
          value: "DX",
          label: "电信",
          children: [
            { value: "直埋", label: "直埋" },
            { value: "其它", label: "其它" }
          ]
        }
      ],
      gxinfo: [],
      gj: 0,
      gxTypeEnable: false
    };
  },
  computed: {
    ...mapState("draw", ["isDraw"]),
    ...mapState("spin", ["spinShown"]),
    ...mapState({
      geomWKT: state => state.distance.geomWKT
    }),
    analyzeEnable() {
      return !(this.gxinfo.length > 0 && this.gj > 0);
    },
    //拼凑管线数组[zy,gj,ylz,msfs,gjvalue]
    gxInfoAllStr() {
      var returnInfo = [];
      var gj = "";
      switch (this.gxinfo[0]) {
        case "JS":
          gj = this.gj <= 200 ? "<=200" : ">200";
          returnInfo = [this.gxinfo[0], gj, "", "", this.gj];
          break;
        case "PS":
          returnInfo = [this.gxinfo[0], "", "", "", this.gj];
          break;
        case "ZS":
          returnInfo = [this.gxinfo[0], "", "", "", this.gj];
          break;
        case "RQ":
          gj = this.gj <= 300 ? "<=300" : ">300";
          returnInfo = [this.gxinfo[0], gj, this.gxinfo[1], "", this.gj];
          break;
        case "RL":
          returnInfo = [this.gxinfo[0], "", "", "", this.gj];
          break;
        case "DL":
          returnInfo = [
            this.gxinfo[0],
            "",
            this.gxinfo[1],
            this.gxinfo[2],
            this.gj
          ];
          break;
      }
      return returnInfo.join(",");
    },
    ...mapState("modal", ["modalState"])
  },
  methods: {
    ...mapMutations("draw", [
      "isDrawChange",
      "isDrawShownChange", //画图工具所画图形关闭或开启
      "moduleTypeChange"
    ]),
    ...mapMutations('globalFeature',["globalFeaturesChange"]),
    startDrawGeom() {
      this.isDrawChange(true); //开启画图
      this.moduleTypeChange("distance"); //设置vuex中draw模块的moduletype值告诉DrawGeometry是统计模块调用画图工具
      //分别去除组织好的需要传的参数

      // getAnalyzeGeometry(this.uploadGeoJsonStr,zy,gj,ylz,msfs,gjvalue).then((res)=>{
      //   console.log(JSON.parse(res.data.data));
      //   let geoJsonResult=JSON.parse(res.data.data);
      //   this.featuresChange(geoJsonResult);
      //   this.gxInfoData=JSON.parse(res.data.data).features.map(x=>x.properties);
      // })
    }
  },
  watch: {
    //监测geom变化后，开始进行分析
    geomWKT(newGeomWKT) {
      let gxInfoList = this.gxInfoAllStr.split(",");
      let zy = gxInfoList[0];
      let gj = gxInfoList[1];
      let ylz = gxInfoList[2];
      let msfs = gxInfoList[3];
      let gjvalue = parseInt(gxInfoList[4]);
      getPolygonbydraw(newGeomWKT, zy, gj, ylz, msfs, gjvalue).then(res => {
        if (res.status === 200) {
          this.$Message.success("分析成功");
          if (JSON.parse(res.data.data).features) {
            let geoJsonResult = JSON.parse(res.data.data);
            this.globalFeaturesChange(geoJsonResult);
            this.isDrawShownChange(false);
          } else {
            //当画的图形下面没有管线，应该直接返回所化图形，后台却直接返回为空
            //这里将wkt数据直接转换为geojson
            let wktnull = new WKT();
            let drawGeometrywkt = wktnull.readFeatures(newGeomWKT);
            let geojsonnull = new GeoJSON();
            let drawGeometryJson = geojsonnull.writeFeatures(drawGeometrywkt);
            this.globalFeaturesChange(JSON.parse(drawGeometryJson));
            this.isDrawShownChange(false);
          }
        } else {
          this.$Message.error("分析失败");
        }

        // this.gxInfoData=JSON.parse(res.data.data).features.map(x=>x.properties);
      });
    },
    //变换后清除drawInteraction
    modalState(newState) {
      this.isDrawChange(false);
    }
  }
};
</script>

<style scoped>
.item-row {
  margin-top: 20px;
  border-bottom: solid 1px white;
  padding-bottom: 10px;
}
.info-table {
  margin: auto 0;
}
.gxinfo-title {
  color: white;
  font-size: 15px;
  display: block;
  text-align: center;
}
.gxinfo-col {
  text-align: center;
}
</style>
