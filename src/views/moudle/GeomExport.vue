<template>
  <div>
    <Loading :spinShown="spinShown"></Loading>
    <Row :gutter="0" class="row-item">
      <i-col span="12" class="col">
        <i-select v-model="geoType" style="width:100px" @on-change="geomFormChange">
          <i-option v-for="item in geoTypes " :value="item.type" :key="item.name">
            {{ item.name }}
            <svg-icon :name="item.type" size="15" color="black"></svg-icon>
          </i-option>
        </i-select>
      </i-col>
      <i-col span="6" class="col">
        <Button @click="startDraw" :disabled="this.geoType === ''? true : false">开始绘画</Button>
      </i-col>
      <i-col span="6" class="col">
        <Button @click="clear">清除</Button>
      </i-col>
    </Row>
    <Row :gutter="0" class="row-item">
      <i-col span="8" class="col">
        <Select v-model="dataType" style="width:100px" @on-change="fileAndCoorChange">
          <Option
            v-for="item in dataTypeList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="8" class="col">
        <Select v-model="coorType" style="width:100px" @on-change="fileAndCoorChange">
          <Option
            v-for="item in coorTypeList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="8" class="col">
        <Button @click="exportFeas" :disabled="isExportDisable">导出</Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Axios from "@/api/axios";
export default {
  name: "GeomExport",
  data() {
    return {
      geoTypes: [
        {
          type: "Point",
          name: "点"
        },
        {
          type: "LineString",
          name: "线"
        },
        {
          type: "Polygon",
          name: "面"
        }
      ],
      geoType: "",
      dataType: "",
      dataTypeList: [
        { value: "ACAD", label: "CAD文件", disabled: true, format: ".dwg" },
        { value: "SHAPE", label: "Shp文件", disabled: false, format: ".shp" }
      ],
      coorType: "",
      coorTypeList: [
        { value: "TJ90", label: "天津90" },
        { value: "CGCS2000", label: "国家2000" },
        { value: "WGS84", label: "WGS84" },
        { value: "GCJ-02", label: "火星坐标系" }
      ],
      downloadUrl: ""
    };
  },
  computed: {
    ...mapState("spin", ["spinShown"]),
    ...mapState("modal", ["modalState"]),
    ...mapState("geomExport", [
      "isClear",
      "exportFeatures",
      "isExport"
    ]),
    isExportDisable() {
      if (this.geoType && this.coorType) {
        return false;
      } else return true;
    }
  },
  methods: {
    //mixins中执行
    ...mapMutations("geomExport", [
      "isDownloadDrawChange",
      "geomTypeChange",
      "dataTypeChange",
      "coorTypeChange",
      "isClearChange",
      "isExportChange"
    ]),
    startDraw() {
      //开启绘画
      this.isDownloadDrawChange(true);
    },
    geomFormChange() {
      this.isDownloadDrawChange(false);
      this.geomTypeChange(this.geoType);
    },
    clear() {
      this.isClearChange(!this.isClear);
    },
    exportFeas() {
      this.isExportChange(!this.isExport);
    },
    fileAndCoorChange(){
      this.dataTypeChange(this.dataType);
      this.coorTypeChange(this.coorType);
    }
  },
  watch: {
    //变换后清除drawInteraction
    modalState(newState) {
      //关闭绘画
      this.isDownloadDrawChange(false);
    }

  }
};
</script>

<style scoped>
.col {
  text-align: center;
}
.row-item {
  padding: 10px 0;
  border-bottom: solid 1px white;
}
</style>