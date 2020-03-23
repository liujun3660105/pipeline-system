<template>
  <div class="map" id="map">
    <CoordinateShown :coordinate-array="coordinateArray" @coorTypeChange="getCoorType"></CoordinateShown>
    <Tools @tileLayerIndexChange="receiveTileLayerIndex"></Tools>
    <Legend></Legend>
    <DrawGeometry></DrawGeometry>
    <SelectFeature></SelectFeature>
    <UploadFeature></UploadFeature>
    <ShowUploadFile></ShowUploadFile>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import TileWMS from "ol/source/TileWMS";
import ImageWMS from "ol/source/ImageWMS";
import Tools from "./tools";
import { transform } from "ol/proj";
import { defaults as defaultControls } from "ol/control.js";
import MousePosition from "ol/control/MousePosition.js";
import { createStringXY } from "ol/coordinate.js";
import {
  defaults as defaultInteractions,
  DragRotateAndZoom
} from "ol/interaction.js";
import Legend from "@/components/map/Legend";
import CoordinateShown from "./CoordinateShown";
import proj from "@/mixins/proj";
import { gcj02tobd09, gcj02towgs84 } from "@/api/latlngTransform";
// import ShowFeatureInfo from '@/views/moudle/search/ShowFeatureInfo'由于与工具条GetFeatureInfo有冲突，暂时取消这个功能
import DrawGeometry from "@/components/map/DrawGeometry";
import SelectFeature from "@/views/moudle/search/SelectFeature";
import UploadFeature from "@/views/moudle/collide/UploadFeature";
import ShowUploadFile from "../../views/moudle/uploadfile/ShowUploadFile";
import config from "@/config";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Map",
  provide() {
    return {
      mapComponent: this
    };
  },
  data() {
    return {
      map: null,
      view: null,
      xyzIndex: 0,
      themeLayers: [
        //图层显示顺序是下面的覆盖上面的
        //增加图层：1.Map组件增加专题图层；2.store中access增加图层权限；3.getFeatureInfo增加图层属性信息 4.popupOverlay指定谁显示
        {
          value: "xzbj",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/xzjx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "xzjx:xzjx",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "jz",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/xzjx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "xzjx:jz",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "gnq",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/xzjx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "xzjx:gnq",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "scllgkfjx",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/ghkzx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "ghkzx:scllgkfjx",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "kg",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/yd/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "yd:kg-ysp20190613",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "tg",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/yd/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "yd:tg20180507",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "tdlyxz",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/yd/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "yd:tdlyxz",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "ghlw",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/jt/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "jt:jt-ghlw",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "ghgd",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/jt/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "jt:jt-ghgd",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "hybj",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/ghkzx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "ghkzx:hybj",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "yjjbnt",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/ghkzx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "ghkzx:yjjbnt",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "cskfbj",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/ghkzx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "ghkzx:cskfbj",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "hx",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/ghkzx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "ghkzx:hx",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "lx",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/ghkzx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "ghkzx:lx",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "sthx",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/ghkzx/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "ghkzx:sthx",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "hdlx",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/hd/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "hd:hd-hdlx",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "wxcz",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/wxy/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "wxy:wxcz",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
                {
          value: "wxzd",
          layer: new TileLayer({
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/wxy/wms",
              params: {
                FORMAT: "image/png",
                VERSION: "1.1.1",
                LAYERS: "wxy:wxzd",
                exceptions: "application/vnd.ogc.se_inimage"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "xm",
          layer: new TileLayer({
            name: "xm",
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/pipeline/wms",
              params: {
                tiled: true,
                LAYERS: "pipeline:xmline"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "wt",
          layer: new TileLayer({
            name: "wt",
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/pipeline/wms",
              params: {
                tiled: true,
                LAYERS: "pipeline:prospectlinegcj,pipeline:prospectpointgcj"
                // "CQL_FILTER": "gxdldm='JS';gddldh='JS'"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "pc",
          layer: new TileLayer({
            name: "pc",
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/pipeline/wms",
              params: {
                FORMAT: "image/png",
                // 'VERSION': '1.1.1',
                LAYERS: "pipeline:puchaline,pipeline:puchapoint",
                exceptions: "application/vnd.ogc.se_inimage",
                CQL_FILTER: "ly='普查';ly='普查'"
                // tilesOrigin: 93615.0703125 + "," + 236681.1875,
                //'CQL_FILTER': "projectid='" + projectid + "'"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "dh",
          layer: new TileLayer({
            name: "dh",
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/pipeline/wms",
              params: {
                FORMAT: "image/png",
                // 'VERSION': '1.1.1',
                LAYERS: "pipeline:puchaline,pipeline:puchapoint",
                exceptions: "application/vnd.ogc.se_inimage",
                CQL_FILTER: "ly='示意';ly='示意'"
                // tilesOrigin: 93615.0703125 + "," + 236681.1875,
                //'CQL_FILTER': "projectid='" + projectid + "'"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        },
        {
          value: "sy",
          layer: new TileLayer({
            name: "sy",
            source: new TileWMS({
              url: config.layerUrl + "/geoserver/pipeline/wms",
              params: {
                FORMAT: "image/png",
                // 'VERSION': '1.1.1',
                LAYERS: "pipeline:puchaline,pipeline:puchapoint",
                exceptions: "application/vnd.ogc.se_inimage",
                CQL_FILTER: "ly='调绘';ly='调绘'"
                // tilesOrigin: 93615.0703125 + "," + 236681.1875,
                //'CQL_FILTER': "projectid='" + projectid + "'"
              },
              projection: "EPSG:4326"
            }),
            zIndex: 2,
            visible: false
          })
        }
      ],
      // selectedVectorLayer:{a:1},
      // selectedVectorSource:null,
      selectedFeatures: [],
      coordinateArray: [],
      coorType: "",
      filterStr: "" //管线图层类过滤信息
    };
  },
  mixins: [proj],
  computed: {
    ...mapState("legend", ["selectedList"]),
    //得到layer传过来的图层
    getSelectedLayers() {
      return this.$store.state.layer.layers;
    }
    // getKeyWord(){
    //   return this.$store.state.search.searchParams;
    // },
    //从vuex中获取features
    // getSelectedFeatures(){
    //   return this.$store.state.search.features
    //   //从后端传来的数据成果有两种形式，一种是geojson数据，一种是json数据，对应后台的sql语句
    //   //注释部分为json部分，但是feature和properities是分离的，对于后期不好实现点击查看要素信息,所以利用的是geojson数据
    //   // let selectedGeoms=[];
    //   // selectedFeatures.forEach((feature,index)=>{
    //   //   console.log(JSON.parse(feature.geom));
    //   //   selectedGeoms.push(JSON.parse(feature.geom).coordinates);
    //   // });
    // },
    // getDbClickRowXmId(){
    //   return this.$store.state.search.DbClickRowXmId;
    // },
    // getDrawGeometry(){
    //   return this.$store.state.search.geometry
    // }
  },
  components: {
    Tools,
    Legend,
    // ShowFeatureInfo,
    DrawGeometry,
    SelectFeature,
    UploadFeature,
    CoordinateShown,
    ShowUploadFile
  },
  mounted() {
    this.initMap();
    this.$emit("ready"); //如果不写，则其他组件无法使用ready的混入
  },
  methods: {
    initMap() {
      var projectionExtent = [-180, -90, 180, 90]; //坐标系范围
      var extent = [117, 38.5, 118, 39.5]; //显示范围
      //切片编号调试图层
      // var tileDebugLayer=new TileLayer({
      //   source:new TileDebug({
      //     projection:'EPSG:4326',
      //     tileGrid:tileGird,
      //     extent:extent
      //   }),
      //   zIndex:4
      // });//测试瓦片
      //设置视图
      this.view = new View({
        zoom: 12,
        center: transform([117.7, 39], "EPSG:4326", "EPSG:3857"),
        projection: "EPSG:3857",
        // extent: extent,
        minZoom: 10
      });

      //设置鼠标移动时显示坐标值得控件

      var mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: "EPSG:4326"
        // className: 'custom-mouse-position'
      });
      //设置map
      this.map = new Map({
        target: "map",
        controls: defaultControls(),
        interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
        view: this.view
      });
      this.map.on("pointermove", e => {
        this.handleCoorType(e);
      });
      this.addLayersToMap();

      //设置筛选出的要素相关图层和源
      // this.selectedVectorSource=new Vector();
      // this.selectedVectorLayer=new VectorLayer({
      //   source:this.selectedVectorSource,
      //   // new Vector({
      //   // features:features
      //   //这里features是数组
      //   // features:[new Feature({
      //   //   geometry:new MultiLineString(this.getSelectedFeatures)
      //   // })]
      //   // features:new Collection({
      //   //   array:new MultiLineString(this.getSelectedFeatures)
      //   // })
      //   // }),
      //   style:new Style({
      //     fill: new Fill({
      //       color: 'rgba(255, 255, 255, 0.2)'
      //     }),
      //     stroke: new Stroke({
      //       color: 'rgba(0, 0, 0, 0.5)',
      //       lineDash: [10, 10],
      //       width: 5
      //     }),
      //     image: new CircleStyle({
      //       radius: 5,
      //       stroke: new Stroke({
      //         color: 'rgba(0, 0, 0, 0.7)'
      //       }),
      //       fill: new Fill({
      //         color: 'rgba(255, 255, 255, 0.2)'
      //       })
      //     })
      //   }),
      //   zIndex:3
      // });
      // this.map.addLayer(this.selectedVectorLayer);
    },
    //将data中初始化的图层依次添加到地图中
    addLayersToMap() {
      this.themeLayers.forEach((layerObject, index) => {
        if (layerObject) {
          this.map.addLayer(layerObject.layer);
        }
      });
    },
    //接收从Tools传来的底图index
    receiveTileLayerIndex(index) {
      this.xyzIndex = index;
    },
    handleCoorType(e) {
      if (e.coordinate && e.coordinate.length) {
        let coordinate = transform(e.coordinate, "EPSG:3857", "EPSG:4326");
        switch (this.coorType) {
          case "CGCS2000":
            this.coordinateArray = transform(
              gcj02towgs84(coordinate[0], coordinate[1]),
              "EPSG:4326",
              "EPSG:4509"
            );
            break;
          case "TJ90":
            this.coordinateArray = transform(
              gcj02towgs84(coordinate[0], coordinate[1]),
              "EPSG:4326",
              "EPSG:90"
            );
            break;
          case "WGS84":
            this.coordinateArray = gcj02towgs84(coordinate[0], coordinate[1]);
            break;
          case "GCJ-02":
            this.coordinateArray = coordinate;
            break;
          case "BD09":
            this.coordinateArray = gcj02tobd09(coordinate[0], coordinate[1]);
            break;
        }
      }
    },
    getCoorType(coorType) {
      this.coorType = coorType;
    }
  },
  watch: {
    //当layer组件中的显示图层发生变化，对themeLayers的图层进行visible设置
    getSelectedLayers(newLayerList, oldLayerList) {
      let indexList = [];
      newLayerList.forEach(layer => {
        if (layer) {
          let index = this.themeLayers.findIndex(themeLayer => {
            return themeLayer.value === layer.value;
          });
          indexList.push(index);
          this.themeLayers[index].layer.setVisible(true);
        }
      });

      //在themeLayer中找到不属于Layer组件传过来的图层，设置成false
      let differentLayers = this.themeLayers.filter((v, i, arr) => {
        return indexList.indexOf(i) < 0;
      });
      if (differentLayers.length > 0) {
        differentLayers.forEach(v => {
          v.layer.setVisible(false);
        });
      }
    },
    //对搜索的关键字和搜索类型进行监听，点击Search组件搜索按钮后，vuex中search模块的数据发生改变
    //异步获取xmline表的要素数据，更改vuex中search模块的features
    // getSelectedFeatures(newFeatureList){
    //   this.selectedVectorSource.clear();
    //   if(newFeatureList.features){//如果查询的结果不为空，则进行要素显示和定位
    //     let selectedFeatures=new GeoJSON().readFeatures(newFeatureList);
    //     this.selectedVectorSource.addFeatures(selectedFeatures);
    //     this.map.getView().fit(this.selectedVectorSource.getExtent());
    //   }
    // },

    //双击表格某一行，得到这一行数据的项目编号
    // getDbClickRowXmId(newXmId){
    //   this.selectedFeatures.forEach(feature=>{
    //     feature.setStyle(null);
    //   });
    //   this.selectedFeatures=this.selectedVectorSource.getFeatures().filter(feature=>{
    //     return feature.getProperties().xmbm===newXmId
    //   });
    //   let style=new Style({
    //     stroke: new Stroke({
    //       color: 'rgba(220, 20, 60, 0.9)',
    //       lineDash: [10, 10],
    //       width: 5
    //     }),
    //   });
    //   let geometries=[];
    //   this.selectedFeatures.forEach(feature=>{
    //     geometries.push(feature.getGeometry());
    //     feature.setStyle(style);
    //   });
    //   let geometryCollection=new GeometryCollection(geometries);
    //   this.map.getView().fit(geometryCollection.getExtent());
    // }

    /**
     * 每当触发Legend的开关按钮
     * newSeletedList ['PS','JS','ZS']
     *
     */
    selectedList(newSeletedList) {
      let pipelineFilterStr;
      let pipePointFilterStr;
      //对返回过来的数组 拼接过滤字符串
      if (newSeletedList.length > 0) {
        pipelineFilterStr = newSeletedList
          .map(item => {
            return "gxdldm=" + "'" + item + "'";
          })
          .join(" OR "); //管线筛选sql
        pipePointFilterStr = newSeletedList
          .map(item => {
            return "gddldh=" + "'" + item + "'";
          })
          .join(" OR "); //管点筛选sql
      } else {
        pipelineFilterStr = "gxdldm=''";
        pipePointFilterStr = "gddldh=''";
      }

      // this.filterStr = pipelineFilterStr+ ";"+ pipePointFilterStr;
      //过滤地图上所有图层，进行更新source之前，先对多有图层进行筛选，只对wt pc dh sy图层进行操作
      this.map
        .getLayers()
        .getArray()
        .filter(layer => {
          return ["wt", "pc", "dh", "sy", "xm"].includes(
            layer.getProperties().name
          );
        })
        .forEach(layer => {
          //遍历筛选出的这四个图层，由于wt和其它三个图层在过滤字符串上 不一样，所以区别对待
          let filterStr = "";
          if (
            layer.getProperties().name == "wt" ||
            layer.getProperties().name == "xm"
          ) {
            filterStr = pipelineFilterStr + ";" + pipePointFilterStr;
          } else {
            let preAllFilterStr = layer.getSource().getParams()["CQL_FILTER"];
            let preFilterStr = preAllFilterStr.split(";")[0];
            let indexAND = preFilterStr.indexOf(" AND ");
            let subStr =
              indexAND === -1 ? preFilterStr : preFilterStr.slice(0, indexAND); //获取"ly=''"
            filterStr =
              subStr +
              " AND " +
              "(" +
              pipelineFilterStr +
              ")" +
              ";" +
              subStr +
              " AND " +
              "(" +
              pipePointFilterStr +
              ")";
          }
          layer.getSource().updateParams({
            CQL_FILTER: filterStr
          });
          layer.getSource().refresh(); //没有这一句也可以实现，但是在切换的时候，容易出现聚簇现象(防止地图上出现聚簇现象)
        });
    }
  }
};
</script>

<style scoped>
.map {
  /*两个作用,为了让map这个窗口自适应content这个div,还有就是getfeaturesbypixel包括draw鼠标*/
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
