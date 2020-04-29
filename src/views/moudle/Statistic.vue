<template>
  <div class="statistic">
    <Loading :spinShown="spinShown"></Loading>

    <!-- <Spin fix class="spin-class" v-if="spinShown">
      <Icon type="ios-loading" size="20" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>-->
      <Row :gutter="50" class="item-row">
        <i-col
          span="8"
          v-for="(infor, i) in inforCardData"
          :key="`infor-${i}`"
          style="height: 80px;"
        >
          <InforCard shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
            <count-to :end="infor.count" countClass="count-style">
              <span slot="right" class="count-unit">km</span>
            </count-to>
            <p>{{ infor.title }}</p>
          </InforCard>
        </i-col>
      </Row>
      <Row :gutter="50" class="item-row">
        <i-col span="24">
          <Select v-model="dataType" style="width:200px">
            <Option
              v-for="item in dataTypeList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <Button icon="ios-search" @click="searchByPolygon" style="margin-left:50px;">画面统计</Button>
          <span style="color: #BBFFFF;font-size:15px;">通过自定义面进行统计</span>
        </i-col>
      </Row>
      <!--v-if="isShownChart"-->
      <div>
        <Row :getter="50" class="item-row">
          <i-col span="12">
            <Card shadow>
              <ChartPie
                style="height: 300px;"
                :pieData="piePcData"
                :pieInnerData="piePcInnerData"
                text="普查数据"
              ></ChartPie>
            </Card>
          </i-col>
          <i-col span="12">
            <Card shadow>
              <ChartPie
                style="height: 300px;"
                :pieData="pieWtData"
                :pieInnerData="pieWtInnerData"
                text="物探数据"
              ></ChartPie>
            </Card>
          </i-col>
        </Row>
        <Row :getter="50" class="item-row">
          <i-col span="24">
            <Card shadow>
              <ChartBar style="height: 300px;" :barData="barGhData" text="规划数据"></ChartBar>
            </Card>
          </i-col>
        </Row>
      </div>

    <!--<div v-else class="waiting">-->
    <!--<Col class="demo-spin-col" span="26">-->
    <!--<Spin fix>-->
    <!--<Icon type="ios-loading" size=50  class="demo-spin-icon-load"></Icon>-->
    <!--<div>Loading</div>-->
    <!--</Spin>-->
    <!--</Col>-->
    <!--</div>-->

    <!--<div class="statistic-item">-->
    <!--<div class="item-header">-->
    <!--&lt;!&ndash;<span>普查数据</span>&ndash;&gt;-->
    <!--<div v-for="infor in inforCardData">-->

    <!--</div>-->
    <!--<IconCard shadow :color="infor.color" :icon="infor.icon" :icon-size="36">-->
    <!--<CountTo :end="infor.count" count-class="count-style"/>-->
    <!--<p>{{ infor.title }}</p>-->
    <!--</IconCard>-->

    <!--</div>-->
    <!--</div>-->
    <!--<div class="statistic-item"></div>-->
    <!--<div class="statistic-item"></div>-->
  </div>
</template>

<script>
import InforCard from "@/components/info-card";
import CountTo from "@/components/count-to";
import { ChartPie, ChartBar, ChartLine } from "@/components/charts";
import { getTotalLength, getChartInitData } from "@/api/statistic.js";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Statistic",
  components: {
    InforCard,
    CountTo,
    ChartBar,
    ChartPie,
    ChartLine
  },
  data() {
    return {
      // isDraw:false,
      isShownChart: false,
      dataType: "",
      geom: "",
      dataTypeList: [
        { value: "pc", label: "普查数据" },
        { value: "wt", label: "物探数据" },
        { value: "xm", label: "规划数据" },
        { value: "all", label: "所有数据" }
      ],
      inforCardData: [
        {
          title: "普查数据",
          icon: "ios-folder",
          count: 1,
          color: "#2d8cf0",
          datatype: "pc"
        },
        {
          title: "物探数据",
          icon: "md-list-box",
          count: 1,
          color: "#19be6b",
          datatype: "wt"
        },
        {
          title: "规划数据",
          icon: "ios-create",
          count: 1,
          color: "#ff9900",
          datatype: "xm"
        }
      ],
      piePcData: [
        { value: 0, name: "给水" },
        { value: 0, name: "中水" },
        { value: 0, name: "排水" },
        { value: 0, name: "燃气" },
        { value: 0, name: "电力" },
        { value: 0, name: "电信" },
        { value: 0, name: "热力" },
        { value: 0, name: "工业" },
        { value: 0, name: "其它" }
      ],
      piePcInnerData: [
        { value: 0, name: "普查" },
        { value: 0, name: "示意" },
        { value: 0, name: "调绘" }
      ],
      pieWtData: [
        { value: 0, name: "给水" },
        { value: 0, name: "中水" },
        { value: 0, name: "排水" },
        { value: 0, name: "燃气" },
        { value: 0, name: "电力" },
        { value: 0, name: "电信" },
        { value: 0, name: "热力" },
        { value: 0, name: "工业" },
        { value: 0, name: "其它" }
      ],
      pieWtInnerData: [
        { value: 0, name: "已审批" },
        { value: 0, name: "所内设计" },
        { value: 0, name: "所内审查" }
      ],
      barGhData: [
        { count: 0, length: 0, name: "给水" },
        { count: 0, length: 0, name: "中水" },
        { count: 0, length: 0, name: "排水" },
        { count: 0, length: 0, name: "燃气" },
        { count: 0, length: 0, name: "电力" },
        { count: 0, length: 0, name: "电信" },
        { count: 0, length: 0, name: "热力" },
        { count: 0, length: 0, name: "工业" },
        { count: 0, length: 0, name: "其它" }
      ]
      // barData: [
      //   {'阶段': '调绘', '给水': 43.3, '中水': 85.8, '排水': 93.7, '燃气':52, '电力':105, '电信':80, '热力':90, '工业':55, '其它':98},
      //   {'阶段': '示意', '给水': 43.3, '中水': 85.8, '排水': 93.7, '燃气':52, '电力':105, '电信':80, '热力':90, '工业':55, '其它':98},
      //   {'阶段': '普查', '给水': 43.3, '中水': 85.8, '排水': 93.7, '燃气':52, '电力':105, '电信':80, '热力':90, '工业':55, '其它':98}
      // ]
    };
  },
  computed: {
    ...mapState("draw", ["isDraw"]),
    ...mapState({
      geomWKT: state => state.statistic.geomWKT
    }),
    ...mapState("spin", ["spinShown"]),
    ...mapState("modal", ["modalState"])
  },
  methods: {
    ...mapMutations("draw", ["isDrawChange", "moduleTypeChange"]),
    /**
     * @param {*} standardList 列表  data中定义的标准数据格式
     * @param {*} getList 列表  后端返回的数据
     * @description 对后端返回的列表进行查找，找到和data中对应的，就把值赋给data对应的key上的value
     */
    searchObject(standardList, getList) {
      standardList.forEach(item => {
        let dataIndex = getList.findIndex(data => {
          return data.name === item.name;
        });
        if (dataIndex >= 0) {
          item.value = Math.round(getList[dataIndex].sum / 1000);
        } else {
          item.value = 0;
        }
      });
    },
    searchXmLengthObject(standardList, getList) {
      standardList.forEach(item => {
        let dataIndex = getList.findIndex(data => {
          return data.name === item.name;
        });
        if (dataIndex >= 0) {
          item.length = Math.round(getList[dataIndex].sum / 1000);
        } else {
          item.length = 0;
        }
      });
    },
    searchXmCountObject(standardList, getList) {
      standardList.forEach(item => {
        let dataIndex = getList.findIndex(data => {
          return data.name === item.name;
        });
        if (dataIndex >= 0) {
          item.count = getList[dataIndex].count;
        } else {
          item.count = 0;
        }
      });
    },
    getChartInitData(geom, dataType) {
      getChartInitData(geom, dataType).then(res => {
        this.isShownChart = true;
        // 普查专业
        let getPcDatabyZy = res.data.data.pc.zy;
        this.searchObject(this.piePcData, getPcDatabyZy);
        //普查来源
        let getPcDatabyLy = res.data.data.pc.ly;
        this.searchObject(this.piePcInnerData, getPcDatabyLy);
        //物探专业
        let geWtDatabyZy = res.data.data.wt.zy;
        this.searchObject(this.pieWtData, geWtDatabyZy);
        //物探来源
        let geWtDatabyLy = res.data.data.wt.ly;
        this.searchObject(this.pieWtInnerData, geWtDatabyLy);
        //规划专业长度
        let geXmLengthbyZy = res.data.data.xm.zylength;
        this.searchXmLengthObject(this.barGhData, geXmLengthbyZy);
        //规划专业数量
        let geXmCountbyZy = res.data.data.xm.zycount;
        this.searchXmCountObject(this.barGhData, geXmCountbyZy);
      });
    },
    getSumLength() {
      getTotalLength().then(res => {
        this.inforCardData.forEach((item, index) => {
          let valueIndex = res.data.data.findIndex(object => {
            return object.datatype === item.datatype;
          });
          this.inforCardData[index].count = Math.round(
            res.data.data[valueIndex].sum / 1000
          );
        });
      });
    },
    searchByPolygon() {
      if (this.dataType) {
        // this.isShownChart=false;
        // this.isDraw=true;//设置按钮不可用
        this.isDrawChange(true); //开启画图
        this.moduleTypeChange("statistic"); //设置vuex中draw模块的moduletype值告诉DrawGeometry是统计模块调用画图工具
      } else {
        this.$Message.warning({
          content: "请选择搜索的项目类型！",
          duration: 1
        });
      }
    }
  },
  watch: {
    geomWKT(newGeomWKT) {
      this.isShownChart = false; //刚画完图形，图标隐藏，显示等待
      getChartInitData(newGeomWKT, this.dataType).then(res => {
        console.log("查询完成");
        console.log("图形变换后结果", res.data.data);
        this.isShownChart = true; //查询完成后，图表显示
        switch (this.dataType) {
          case "pc":
            // 普查专业
            let getPcDatabyZy = res.data.data.pc.zy;
            if (!getPcDatabyZy) {
              this.piePcData = [
                { value: 0, name: "给水" },
                { value: 0, name: "中水" },
                { value: 0, name: "排水" },
                { value: 0, name: "燃气" },
                { value: 0, name: "电力" },
                { value: 0, name: "电信" },
                { value: 0, name: "热力" },
                { value: 0, name: "工业" },
                { value: 0, name: "其它" }
              ];
            } else {
              this.searchObject(this.piePcData, getPcDatabyZy);
            }

            //普查来源
            let getPcDatabyLy = res.data.data.pc.ly;
            if (!getPcDatabyLy) {
              this.piePcInnerData = [
                { value: 0, name: "已审批" },
                { value: 0, name: "所内设计" },
                { value: 0, name: "所内审查" }
              ];
            } else {
              this.searchObject(this.piePcInnerData, getPcDatabyLy);
            }
            break;
          case "wt":
            //物探专业
            let geWtDatabyZy = res.data.data.wt.zy;
            if (!geWtDatabyZy) {
              this.pieWtData = [
                { value: 0, name: "给水" },
                { value: 0, name: "中水" },
                { value: 0, name: "排水" },
                { value: 0, name: "燃气" },
                { value: 0, name: "电力" },
                { value: 0, name: "电信" },
                { value: 0, name: "热力" },
                { value: 0, name: "工业" },
                { value: 0, name: "其它" }
              ];
            } else {
              this.searchObject(this.pieWtData, geWtDatabyZy);
            }
            //物探来源
            let geWtDatabyLy = res.data.data.wt.ly;
            if (!geWtDatabyLy) {
              this.pieWtInnerData = [
                { value: 0, name: "已审批" },
                { value: 0, name: "所内设计" },
                { value: 0, name: "所内审查" }
              ];
            } else {
              this.searchObject(this.pieWtInnerData, geWtDatabyLy);
            }

            break;
          case "xm":
            //规划专业长度规划专业项目数量，有项目的地方就一定有长度
            let geXmLengthbyZy = res.data.data.xm.zylength;

            let geXmCountbyZy = res.data.data.xm.zycount;
            if (!geXmLengthbyZy) {
              this.barGhData = [
                { count: 0, length: 0, name: "给水" },
                { count: 0, length: 0, name: "中水" },
                { count: 0, length: 0, name: "排水" },
                { count: 0, length: 0, name: "燃气" },
                { count: 0, length: 0, name: "电力" },
                { count: 0, length: 0, name: "电信" },
                { count: 0, length: 0, name: "热力" },
                { count: 0, length: 0, name: "工业" },
                { count: 0, length: 0, name: "其它" }
              ];
            } else {
              this.searchXmLengthObject(this.barGhData, geXmLengthbyZy);
              this.searchXmCountObject(this.barGhData, geXmCountbyZy);
            }
            break;
          case "all":
            // 普查专业
            let getPcDatabyZy1 = res.data.data.pc.zy;
            if (!getPcDatabyZy1) {
              this.piePcData = [
                { value: 0, name: "给水" },
                { value: 0, name: "中水" },
                { value: 0, name: "排水" },
                { value: 0, name: "燃气" },
                { value: 0, name: "电力" },
                { value: 0, name: "电信" },
                { value: 0, name: "热力" },
                { value: 0, name: "工业" },
                { value: 0, name: "其它" }
              ];
            } else {
              this.searchObject(this.piePcData, getPcDatabyZy1);
            }

            //普查来源
            let getPcDatabyLy1 = res.data.data.pc.ly;
            if (!getPcDatabyLy1) {
              this.piePcInnerData = [
                { value: 0, name: "普查" },
                { value: 0, name: "示意" },
                { value: 0, name: "调绘" }
              ];
            } else {
              this.searchObject(this.piePcInnerData, getPcDatabyLy1);
            }
            //物探专业
            let geWtDatabyZy1 = res.data.data.wt.zy;
            if (!geWtDatabyZy1) {
              this.pieWtData = [
                { value: 0, name: "给水" },
                { value: 0, name: "中水" },
                { value: 0, name: "排水" },
                { value: 0, name: "燃气" },
                { value: 0, name: "电力" },
                { value: 0, name: "电信" },
                { value: 0, name: "热力" },
                { value: 0, name: "工业" },
                { value: 0, name: "其它" }
              ];
            } else {
              this.searchObject(this.pieWtData, geWtDatabyZy1);
            }
            //物探来源
            let geWtDatabyLy1 = res.data.data.wt.ly;
            if (!geWtDatabyLy1) {
              this.pieWtInnerData = [
                { value: 0, name: "已审批" },
                { value: 0, name: "所内设计" },
                { value: 0, name: "所内审查" }
              ];
            } else {
              this.searchObject(this.pieWtInnerData, geWtDatabyLy1);
            }
            //规划专业长度规划专业项目数量，有项目的地方就一定有长度
            let geXmLengthbyZy1 = res.data.data.xm.zylength;
            let geXmCountbyZy1 = res.data.data.xm.zycount;
            if (!geXmLengthbyZy1) {
              this.barGhData = [
                { count: 0, length: 0, name: "给水" },
                { count: 0, length: 0, name: "中水" },
                { count: 0, length: 0, name: "排水" },
                { count: 0, length: 0, name: "燃气" },
                { count: 0, length: 0, name: "电力" },
                { count: 0, length: 0, name: "电信" },
                { count: 0, length: 0, name: "热力" },
                { count: 0, length: 0, name: "工业" },
                { count: 0, length: 0, name: "其它" }
              ];
            } else {
              this.searchXmLengthObject(this.barGhData, geXmLengthbyZy1);
              this.searchXmCountObject(this.barGhData, geXmCountbyZy1);
            }
        }
      });
    },
        //变换后清除drawInteraction
    modalState(newState) {
      this.isDrawChange(false);
    }
  },
  mounted() {},
  created() {
    this.getSumLength();
    this.getChartInitData(this.geom, this.dataType);
  }
};
</script>

<style scoped>
.count-unit {
  font-size: 20px;
}
.statistic {
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
}
.item-row {
  margin-top: 15px;
  /*text-align:center;*/
}

.data-title {
  font-size: 20px;
  color: white;
}
.demo-spin-col {
  height: 800px;
  position: relative;
}
.waiting {
  margin-top: 20px;
}
.ivu-spin-fix {
  background-color: rgba(0, 0, 0, 0);
}
</style>
