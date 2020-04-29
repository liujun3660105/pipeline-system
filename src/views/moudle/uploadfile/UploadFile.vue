<template>
  <div class="upload-file">
    <Spin fix class="spin-class" v-if="spinShown">
      <Icon type="ios-loading" size="20" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
    <Row :gutter="0" class="item-row">
      <i-col span="12">
        <Row class="item-item-row">
          <i-col span="18">
            <span class="info-title">请选择上传数据的数据格式:</span>
          </i-col>
          <i-col span="6">
            <Select v-model="dataType" style="width:100px">
              <Option
                v-for="item in dataTypeList"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"
              >{{ item.label }}</Option>
            </Select>
          </i-col>
        </Row>
        <Row class="item-item-row">
          <i-col span="18">
            <span class="info-title">请选择上传数据的坐标系:</span>
          </i-col>
          <i-col span="6">
            <Select v-model="coorType" style="width:100px">
              <Option
                v-for="item in coorTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </i-col>
        </Row>
      </i-col>
      <i-col span="12">
        <div class="upload-item">
          <input
            id="file-upload"
            class="input-file-class"
            :disabled="startUpload"
            type="file"
            :accept="accept"
            :format="format"
            :multiple="dataType==='shp,shx,dbf'"
            @change="uploadFiles"
            ref="upload"
          />
          <Button @click="runWorkSpace" v-if="uploadButtonShown">上传文件</Button>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import FMEServer from "@/api/FMEServer";
import { verifyToken } from "@/api/user";
import { mapMutations } from "vuex";
export default {
  name: "UploadFile",
  data() {
    return {
      dataType: "",
      coorType: "",
      dataTypeList: [
        { value: "dwg", label: "CAD文件", disabled: false, format: ".dwg" },
        {
          value: "shp,shx,dbf",
          label: "Shp文件",
          disabled: false,
          format: ".shp,.shx,.dbf"
        }
      ],
      coorTypeList: [
        { value: "TJ90", label: "天津90" },
        { value: "CGCS2000", label: "国家2000" },
        { value: "WGS84", label: "WGS84" },
        { value: "GCJ-02", label: "火星坐标系" }
      ],
      repository: "RESTTraining",
      fileInput: null,
      path: "",
      files: [],
      uploadButtonShown: false,
      spinShown:false
    };
  },
  computed: {
    format() {
      if (this.dataType) {
        return this.dataType.split(",");
      } else {
        return new Array("");
      }
    },
    accept() {
      if (this.dataType) {
        let index = this.dataTypeList.findIndex(item => {
          return item.value === this.dataType;
        });
        return this.dataTypeList[index].format;
      } else {
        return "";
      }
    },
    startUpload() {
      return !(this.dataType && this.coorType);
    },
    sourceDataType() {
      return this.dataType === "dwg" ? "ACAD" : "SHAPE";
    },
    workspace() {
      return this.dataType === "dwg"
        ? "CADeasyTranslatorToGEOJSON.fmw"
        : "SHPeasyTranslatorToGEOJSON.fmw";
    }
  },
  methods: {
    ...mapMutations(["featuresChange", "DbClickRowXmIdChange"]),
    ...mapMutations("upload", ["uploadFeaturesChange"]),

    //开始运转模型
    runWorkSpace() {
      verifyToken().then(res => {
        this.uploadButtonShown = false; //隐藏上传按钮
        this.spinShown = true; //开启等待界面
        let sourcefilePath =
          this.dataType === "dwg" ? this.files[0].path : this.files[1].path;

        // let params = 'SourceDataset_GENERIC'+'='+this.files[0].path+'&'+'SourceFormat'+'='+this.sourceDataType+'&'+'COORDSYS'+'='+this.coorType;
        let CADparams =
          "SourceDataset_ACAD" +
          "=" +
          sourcefilePath +
          "&" +
          "SourceFormat" +
          "=" +
          this.sourceDataType +
          "&" +
          "COORDSYS" +
          "=" +
          this.coorType +
          "&" +
          "DestinationFormat" +
          "=" +
          "GeoJSON";
        let SHPparams =
          "SourceDataset_GENERIC" +
          "=" +
          sourcefilePath +
          "&" +
          "SourceFormat" +
          "=" +
          this.sourceDataType +
          "&" +
          "COORDSYS" +
          "=" +
          this.coorType +
          "&" +
          "DestinationFormat" +
          "=" +
          "GeoJSON";
        let params = this.dataType === "dwg" ? CADparams : SHPparams;

        FMEServer.runDataStreaming(
          this.repository,
          this.workspace,
          params,
          json => {
            if (typeof json === "string") {
              json = JSON.parse(json);
            }
            // document.getElementById('file-upload').outerHTML = document.getElementById('file-upload').outerHTML;
            this.spinShown = false; //关闭等待界面
            document.getElementById("file-upload").value = "";
            let mergeGeoJson = this.mergeGeojson(json);
            this.uploadFeaturesChange(mergeGeoJson);
          }
        );
      });
    },
    //上传文件到FMEServer
    uploadFiles(e) {
      verifyToken().then(res => {
        this.uploadButtonShown = false;
        if (e.target.files.length > 0) {
          let fileSize = e.target.files[0].size;
          if (fileSize > 1 * 1024 * 1024) {
            this.$Notice.warning({
              title: "文件过大",
              desc:
                "文件 " +
                e.target.files[0].name +
                " 文件过大，请上传小于1M的文件"
            });
            //清空文件
            // document.getElementById('file-upload').outerHTML = document.getElementById('file-upload').outerHTML;
            document.getElementById("file-upload").value = "";

            return;
          }
          this.spinShown = true; //开启等待界面
          this.fileInput = this.$refs.upload;
          let jsId = parseInt(Math.random() * 100000000);
          FMEServer.dataUpload(
            this.repository,
            this.workspace,
            this.fileInput,
            jsId,
            json => {
              this.spinShown = false; //开启等待界面
              this.uploadButtonShown = true; //显示上传按钮 如果放在外侧，则会导致当用户点击按钮时，文件还没上传完成
              this.files = json.serviceResponse.files.file;
            }
          );
        }
      });
    },

    /**
     * 合并geojson文件，得到{type:"FeatureCollection",featurs:[]}
     * @param json
     * @returns {{features: Array, type: string}}
     */
    mergeGeojson(json) {
      let features = [];
      Object.keys(json).forEach(key => {
        features.push(...json[key].features);
      });
      return { type: "FeatureCollection", features: features };
    }
  },
  mounted() {
    FMEServer.init({
      server: "http://192.168.1.225:8083/",
      token: "07bf2350b5a9a02e282e3b31d7b0a378c7fd4dcb"
    });
  }
};
</script>

<style scoped>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin-class {
  background-color: rgba(119, 136, 153, 0.5);
  color: white;
  font-size: 18px;
}
.input-file-class {
  color: white;
  font-size: 15px;
}
.info-title {
  color: white;
  font-size: 15px;
}
.item-row {
  margin-top: 20px;
  border-bottom: solid 1px white;
  padding-bottom: 10px;
}
.item-item-row {
  /*margin-top:20px;*/
  /*border-bottom:solid 1px white;*/
  padding-bottom: 10px;
}
.upload-item {
  text-align: center;
}
.upload-info {
  color: white;
  font-size: 15px;
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

