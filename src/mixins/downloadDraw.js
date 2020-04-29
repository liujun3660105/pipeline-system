import { mapState, mapMutations } from "vuex";
import Vector from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { Draw, Modify, Snap, Select } from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';
import featureTransform from '@/util/featureTransform';
export default {
    mounted() {
        this.drawVectorSource = new Vector();
        this.drawVectorLayer = new VectorLayer({
            name: 'downLoadDrawLayer',
            source: this.drawVectorSource,
            style: new Style({
                fill: new Fill({
                    color: "rgba(255, 105, 180, 0.4)"
                }),
                stroke: new Stroke({
                    color: "rgba(220, 20, 60, 0.9)",
                    lineDash: [10, 10],
                    width: 5
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: "rgba(0, 0, 0, 0.7)"
                    }),
                    fill: new Fill({
                        color: "rgba(220, 20, 60, 1)"
                    })
                })
            }),
            zIndex: 10
        });
    },
    computed: {
        ...mapState('geomExport', ["isDownloadDraw", "geomType","dataType","coordinateType","isClear",'isExport','exportFeatures']),
        drawInfo() {
            const { isDownloadDraw, geomType } = this;
            return { isDownloadDraw, geomType }
        }
    },
    watch: {
        drawInfo(newInfo) {
            const { isDownloadDraw, geomType } = newInfo;
            if (!isDownloadDraw) {
                if (this.draw) {
                    this.map.removeInteraction(this.draw);
                }
                return;
            }    //如果画图开关关闭
            if (!this.hasLayer(this.drawVectorLayer)) {
                this.map.addLayer(this.drawVectorLayer);
            }//如果map中已经有这个图层了
            this.initDrawInteraction(geomType);
        },
        isClear(newValue){
            this.drawVectorSource.clear();
            this.drawVectorSource.refresh();
        },
        async isExport(newValue){
            const dataType = this.dataType;
            const coorType = this.coordinateType;
            let features = this.featuresToGeoJSON();
            // const Reg = /^[0-9]{8}/;
            // if(Reg.test(newFeatures)){
            //     return
            // }
            if (!features) {
              this.$Message.warning("无要素导出", 1.5);
              return;
            }
      
            const res = await this.$axios.post("/api/export/uploadFile", {
              features: features
            }); //生成FMEServer存放地址
            const { path, name } = res.data.data;
            const result = await this.$axios({
              method: "get",
              url:
                "http://192.168.1.225:8083/fmedatadownload/RESTTraining/GEOJSONToCADSHP.fmw",
              headers: {
                Authorization:
                  "fmetoken token=07bf2350b5a9a02e282e3b31d7b0a378c7fd4dcb",
                Accept: "application/json"
              },
              params: {
                DEST_COORSYS: coorType,
                DestinationFormat: dataType,
                SourceDataset_GEOJSON: `$(FME_SHAREDRESOURCE_TEMP)${path}${name}`,
                opt_responseformat: "json"
              }
            });
            //得到下载链接
            let downloadUrl = result.data.serviceResponse.url;
            
            if(downloadUrl){
                this.download(downloadUrl);
            }else{
                this.$Message.error("导出失败", 1.5);
            }
      

            // this.exportFeaturesChange(features);
        }



    },
    methods: {
        ...mapMutations('geomExport', ['isDownloadDrawChange','exportFeaturesChange']),
        //判断地图中是否包含这个图层
        hasLayer(layer) {
            const layerName = layer.getProperties().name;
            const item = this.map.getLayers().getArray().filter(item => {
                return item.getProperties().name === layerName
            });
            if (item.length > 0) {
                return true
            } else {
                return false
            }

        },
        async initDrawInteraction(geomType) {
            this.map.removeInteraction(this.select);
            this.map.removeInteraction(this.modify);
            this.draw = new Draw({
                source: this.drawVectorSource,
                type: geomType,
                style: new Style({
                    fill: new Fill({
                        color: "rgba(255, 255, 255, 0.4)"
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
            // this.select = new Select({
            //     wrapX: false
            // });
            this.snap = new Snap({ source: this.drawVectorSource });
            
            this.map.addInteraction(this.draw);
            this.map.addInteraction(this.snap);
            this.draw.on('drawstart',evt=>{
                // this.select = null;
                this.map.removeInteraction(this.select);
            })
            this.draw.on('drawend', async  evt => {
                this.isDownloadDrawChange(false);//画完之后，不允许再次画
                this.select = new Select({
                    wrapX: false,
                    layers:[this.drawVectorLayer]
                });
                this.map.addInteraction(this.select);
                this.modify = new Modify({ features: this.select.getFeatures()});
                this.select.on('select', (e) => {//每当选中要素时，才可以进行编辑和删除
                    if (e.target.getFeatures().getLength() > 0) {
                        document.addEventListener('keydown', this.deleteEvent);//绑定键盘delete事件
                        this.map.addInteraction(this.select);//恢复移出的select
                        this.map.addInteraction(this.modify);
                    }else{
                        this.map.removeInteraction(this.select);//移除的select
                        this.map.removeInteraction(this.modify);
                    }
                });
                //将画完的图形输出供导出用

            });


        },
        deleteEvent(event) {
            let e = event || window.event;
            let keyCode = e.keyCode || e.which;
            if (keyCode === 46) {
                this.deleteFeature();
                document.removeEventListener('keydown', this.deleteFeature);//解绑键盘delete事件
            }
        },
        deleteFeature() {
            this.drawVectorSource.removeFeature(this.select.getFeatures().getArray()[0]);
            this.map.removeInteraction(this.select);//此时已经删除，但是select仍然显示，所以需要移出select
            this.map.removeInteraction(this.modify);
        },
        featuresToGeoJSON(){
            let geoJSON = new GeoJSON();
            let sourceFeatures =  this.drawVectorSource.getFeatures();
            let features = featureTransform(sourceFeatures,'EPSG:3857','EPSG:4326');
            if(features.length==0){
                return ''
            }else{
                let featuresString = geoJSON.writeFeatures(features);
                return featuresString;
            }

        },
        download(url) {
            let domA = document.createElement("a");
            domA.setAttribute("display", "none");
            domA.setAttribute("href", url);
            domA.setAttribute("download", url);
            document.body.appendChild(domA);
            // domA.onclick = function(e) {
            //   e.preventDefault();
            // };
            domA.click();
            document.body.removeChild(domA);
          },

    }
}