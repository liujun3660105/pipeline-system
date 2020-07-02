<template>
  <div class="search">
    <Divider dashed>属性查询</Divider>
    <div class="keyword-search">
      <Input v-model="keyWord" placeholder="请输入查询的关键字" style="width: 250px" />
      <Select v-model="keyWordType" style="width:100px">
        <Option v-for="item in ghInfoList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button icon="ios-search" @click="searchByKeyWord">搜索</Button>
    </div>
    <Divider dashed>空间查询</Divider>
    <div class="spatial-search">
      <Select v-model="spatialSelectedType" style="width:100px">
        <Option v-for="item in ghInfoList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <!--<Button icon="ios-search" @click="searchByLineGeometry">画线搜索</Button>-->
      <Button :disabled="isDraw" icon="ios-search" @click="searchByPolygonGeometry">画面搜索</Button>
    </div>
    <Divider dashed>信息展示</Divider>

    <div v-if="isShownTable">
      <Table
        v-if="isShownTableContent"
        @on-row-dblclick="selectRow"
        class="info-table"
        width="490"
        height="400"
        :columns="xmInfoColumns"
        :data="xmInfo"
      ></Table>
      <div v-else class="table-await">
        <Col class="demo-spin-col" span="26">
          <Spin fix>
            <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
        </Col>
      </div>
      <div class="page">
        <Page
          :total="xmCount"
          size="small"
          show-elevator
          @on-change="pageChange"
          :current="currentPage"
        ></Page>
      </div>
    </div>
    <div class="search-none-info" v-else>
      <p>暂无数据</p>
    </div>
    <Button class="button-clear" icon="md-close-circle" @click="clear" v-show="isShownTable">清空</Button>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
const typeObj = { snsj: "所内设计", snsc: "所内审查", ysp: "已审批" };
export default {
  name: "Search",
  data() {
    return {
      keyWord: "",
      keyWordType: "",
      ghInfoList: [
        { value: "snsj", label: "所内设计" },
        { value: "snsc", label: "所内审查" },
        { value: "ysp", label: "已审批" }
      ],
      spatialSelectedType: "",
      xmInfoColumns: [],
      xmAllInfo: [],
      columnWidth: 100,
      isShownTable: false,
      isShownTableContent: false,
      isDraw: false,
      searchFlag: true,
      currentPage: 1,
      isLoading: false,
      btnEnable: true,
      btnValue: "下载",
      tableDisableIndex:-1,
      tableLoadingIndex:-1
    };
  },
  computed: {
    getKeyWord() {
      return this.$store.state.search.searchParams;
    },
    getDrawEnable() {
      return this.$store.state.draw.isDraw;
    },
    getDrawGeometry() {
      return this.$store.state.search.geomWKT;
    },
    ...mapState("modal", ["modalState"]),
    xmCount() {
      return this.xmAllInfo.length;
    },
    xmInfo() {
      return this.xmAllInfo.slice(
        (this.currentPage - 1) * 10,
        this.currentPage * 10
      );
    }
  },
  methods: {
    ...mapMutations("draw", ["isDrawChange", "moduleTypeChange"]),
    async searchByKeyWord() {
      if (this.keyWordType) {
        //修改初始值和vuex中search.js的searchParams
        this.isShownTable = true; //显示表格
        this.resumeBtn(); //还原表格中按钮的内容和可用性

        this.$store.commit("keyWordChange", {
          searchKeyWord: this.keyWord,
          searchType: this.keyWordType
        });
        this.isShownTableContent = false; //显示表格内容
        //设置表头
        //声明下载表头内容
        const downLoadField = {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small",
                  disabled: !(params.index !== this.tableDisableIndex && params.row.hasFile),//disabled和loading不能同步,所以分开定义tableLoadingIndex,tableDisabledIndex
                  // loading: this.isLoading
                  loading:params.index === this.tableLoadingIndex
                },
                on: {
                  click: () => {
                    let index = params.index;
                    let { xmbh } = params.row;
                    this.downloadFile(index,xmbh, this.keyWordType);
                  }
                }
              },
              params.index === this.tableDisableIndex ? (params.index === this.tableDisableIndex?  '已下载' : 'Loading...') : '下载'
            );
          }
        };
        switch (this.keyWordType) {
          case "snsj":
            this.xmInfoColumns = [
              {
                title: "项目编号",
                key: "xmbh",
                width: 150,
                align: "center"
              },
              {
                title: "项目名称",
                key: "xmmc",
                width: 200,
                tooltip: true,
                align: "center"
              },
              {
                title: "专业",
                key: "zy",
                width: 100,
                align: "center"
              },
              {
                title: "设计人",
                key: "sjr",
                width: 100,
                align: "center"
              },
              {
                title: "设计日期",
                key: "sjrq",
                width: 100,
                align: "center"
              },
              {
                title: "备注",
                key: "bz",
                width: 100,
                tooltip: true,
                align: "center"
              },
              downLoadField
            ];
            break;
          case "snsc":
            this.xmInfoColumns = [
              {
                title: "项目编号",
                key: "xmbh",
                width: 150,
                align: "center"
              },
              {
                title: "项目名称",
                key: "xmmc",
                width: 200,
                tooltip: true,
                align: "center"
              },
              {
                title: "项目阶段",
                key: "xmjd",
                width: 100,
                align: "center"
              },
              {
                title: "专业",
                key: "zy",
                width: 100,
                align: "center"
              },
              {
                title: "审查人",
                key: "scr",
                width: 100,
                align: "center"
              },
              {
                title: "发件人",
                key: "sjr",
                width: 100,
                align: "center"
              },
              {
                title: "接收日期",
                key: "sjrq",
                width: 100,
                align: "center"
              },
              {
                title: "回复日期",
                key: "hfrq",
                width: 100,
                align: "center"
              },
              {
                title: "回复情况",
                key: "hfqk",
                width: 100,
                align: "center"
              },
              {
                title: "设计单位",
                key: "sjdw",
                width: 100,
                align: "center",
                tooltip: true
              },
              {
                title: "备注",
                key: "bz",
                width: 100,
                align: "center",
                tooltip: true
              },
              downLoadField
            ];
            break;
          case "ysp":
            this.xmInfoColumns = [
              {
                title: "申请编号",
                key: "sqbh",
                width: 200,
                align: "center"
              },
              {
                title: "项目编号",
                key: "xmbh",
                width: 150,
                align: "center"
              },
              {
                title: "项目名称",
                key: "xmmc",
                width: 200,
                align: "center",
                tooltip: true
              },
              {
                title: "项目阶段",
                key: "xmjd",
                width: 100,
                align: "center"
              },
              {
                title: "专业",
                key: "zy",
                width: 100,
                align: "center"
              },
              {
                title: "坐落地址",
                key: "zldz",
                width: 200,
                align: "center",
                tooltip: true
              },
              {
                title: "设计单位",
                key: "sjdw",
                width: 200,
                align: "center",
                tooltip: true
              },
              {
                title: "申报单位",
                key: "sbdw",
                width: 200,
                align: "center",
                tooltip: true
              },
              {
                title: "申报日期",
                key: "sbrq",
                width: 100,
                align: "center"
              },
              {
                title: "审批日期",
                key: "sprq",
                width: 100,
                align: "center"
              },
              {
                title: "办理状态",
                key: "sbzt",
                width: 100,
                align: "center"
              },
              {
                title: "备注",
                key: "bz",
                width: 100,
                align: "center",
                tooltip: true
              },
              downLoadField
            ];
            break;
        }
        //项目查询
        await this.getXmInfobyKey();
        let xmIds = this.getXmIds(this.xmAllInfo);

        await this.getFeatureById(xmIds);
      } else {
        this.$Message.warning({
          content: "请选择搜索的项目类型！",
          duration: 1
        });
      }
    },
    searchByPolygonGeometry() {
      if (this.spatialSelectedType) {
        this.keyWordType = "";
        this.isDraw = true; //设置按钮不可用
        this.isDrawChange(true); //开启画图
        this.moduleTypeChange("search"); //设置vuex中draw模块的moduletype值告诉DrawGeometry是查询模块调用画图工具
      } else {
        this.$Message.warning({
          content: "请选择搜索的项目类型！",
          duration: 1
        });
      }
    },
    clear() {
      this.isShownTable = false;
      this.$store.commit("featuresChange", []);
    },
    selectRow(val, index) {
      this.$store.commit("DbClickRowXmIdChange", val.xmbh);
    },

    //关键字查询
    //根据关键字得到项目信息
    async getXmInfobyKey() {
      let result = await this.$axios.get("api/search/getxminfobykey", {
        params: {
          keyWord: this.keyWord,
          keyWordType: this.keyWordType
        }
      });
      if (result.status === 200) {
        this.isShownTableContent = true;
        this.xmAllInfo = result.data.data; //得到的是数组
        this.currentPage = 1;
      }
    },
    // 根据得到的项目IDs查找要素信息
    async getFeatureById(Ids) {
      let result = await this.$axios.get("api/search/getfeaturebyid", {
        params: {
          xmIds: Ids
        }
      });
      if (result.status === 200) {
        this.$store.commit("featuresChange", result.data.data[0]);
      }
    },

    //几何查询
    //根据自定义图形得到要素信息
    async getFeaturebyGeom(newGeometryWKT) {
      let result = await this.$axios.get("api/search/getfeaturebygeom", {
        params: {
          drawGeometry: newGeometryWKT,
          searchType: typeObj[this.spatialSelectedType],
          fieldType: this.spatialSelectedType
        }
      });
      if (result.status === 200) {
        const { xmInfo, geojsonResult } = result.data.data;
        this.$store.commit("featuresChange", geojsonResult[0]);
        this.resumeBtn(); //还原表格中按钮的内容和可用性
        this.xmAllInfo = xmInfo;
        this.isShownTableContent = true;
        this.currentPage = 1;
      }
    },
    ////对获得的项目编号进行拼凑[2018,2019]=>"'2018','2019'"
    getXmIds(xmInfoList) {
      //对获得的项目编号进行拼凑[2018,2019]=>"'2018','2019'"
      let xmIdsParam;
      let xmIds = [];
      if (xmInfoList.length !== 0) {
        xmIds = xmInfoList.map(val => {
          return "'" + val.xmbh + "'";
        });
        xmIdsParam = xmIds.join(",");
      } else {
        xmIdsParam = "'" + "'";
      }
      return xmIdsParam;
    },

    //根据项目编号得到规划管线要素信息，进行sql查询@todo
    async getFeature() {
      let features = await this.$axios.get("", {
        params: "xxx"
      });
    },
    pageChange(e) {
      this.currentPage = e;
    },
    //点击下载后，设置下载按钮内容和可用性
    downloadFile(index,xmbh, xmType) {
      this.tableLoadingIndex = index;

      // this.isLoading = true;
      setTimeout(() => {
        // this.btnEnable = false;
        // this.isLoading = false;
        // this.tableIndex = -1;
        this.tableLoadingIndex = -1;
      this.tableDisableIndex = index;

        // this.btnValue = "已下载";
      }, 2000);
      window.open(`http://localhost:5000/files/${xmType}/${xmbh}.zip`);
    },
    //再次点击查询按钮，还原按钮的内容和可用性
    resumeBtn() {
      // this.btnEnable = true;
      // this.btnValue = "下载";
        this.tableLoadingIndex = -1;
      this.tableDisableIndex = -1;
    }
  },
  watch: {
    //属性查询
    //如果vuex中search.js的searchParams发生变化，则进行项目信息查询和相关要素查询
    //前期想当时用户有可能在不改动keyword和keywordtype情况下连续点击两次查询按钮，则为了提高效率，不进行重新查询
    //但是此时如果空间查询或者清除后，再次点击属性查询，由于keyword和keywordtype都没有发生变化，则不进行查询，所以放弃，直接写在按钮事件里

    getDrawEnable(newEnable) {
      this.isDraw = newEnable;
    },
    async getDrawGeometry(newGeometryWKT) {
      this.isShownTable = true; //显示表格
      this.isShownTableContent = false; //显示等待
      //设置表头
        const downLoadField = {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small",
                  disabled: !(params.index !== this.tableDisableIndex && params.row.hasFile),//disabled和loading不能同步,所以分开定义tableLoadingIndex,tableDisabledIndex
                  // loading: this.isLoading
                  loading:params.index === this.tableLoadingIndex
                },
                on: {
                  click: () => {
                    let index = params.index;
                    let { xmbh } = params.row;
                    this.downloadFile(index,xmbh, this.spatialSelectedType);
                  }
                }
              },
              params.index === this.tableDisableIndex ? (params.index === this.tableDisableIndex?  '已下载' : 'Loading...') : '下载'
            );
          }
        };
      switch (this.spatialSelectedType) {
        case "snsj":
          this.xmInfoColumns = [
            {
              title: "项目编号",
              key: "xmbh",
              width: 150,
              align: "center"
            },
            {
              title: "项目名称",
              key: "xmmc",
              width: 200,
              tooltip: true,
              align: "center"
            },
            {
              title: "专业",
              key: "zy",
              width: 100,
              align: "center"
            },
            {
              title: "设计人",
              key: "sjr",
              width: 100,
              align: "center"
            },
            {
              title: "设计日期",
              key: "sjrq",
              width: 100,
              align: "center"
            },
            {
              title: "备注",
              key: "bz",
              width: 100,
              tooltip: true,
              align: "center"
            },
            downLoadField
          ];
          break;
        case "snsc":
          this.xmInfoColumns = [
            {
              title: "项目编号",
              key: "xmbh",
              width: 150,
              align: "center"
            },
            {
              title: "项目名称",
              key: "xmmc",
              width: 200,
              tooltip: true,
              align: "center"
            },
            {
              title: "项目阶段",
              key: "xmjd",
              width: 100,
              align: "center"
            },
            {
              title: "专业",
              key: "zy",
              width: 100,
              align: "center"
            },
            {
              title: "审查人",
              key: "scr",
              width: 100,
              align: "center"
            },
            {
              title: "发件人",
              key: "sjr",
              width: 100,
              align: "center"
            },
            {
              title: "接收日期",
              key: "sjrq",
              width: 100,
              align: "center"
            },
            {
              title: "回复日期",
              key: "hfrq",
              width: 100,
              align: "center"
            },
            {
              title: "回复情况",
              key: "hfqk",
              width: 100,
              align: "center"
            },
            {
              title: "设计单位",
              key: "sjdw",
              width: 100,
              align: "center",
              tooltip: true
            },
            {
              title: "备注",
              key: "bz",
              width: 100,
              align: "center",
              tooltip: true
            },
            downLoadField
          ];
          break;
        case "ysp":
          this.xmInfoColumns = [
            {
              title: "申请编号",
              key: "sqbh",
              width: 200,
              align: "center"
            },
            {
              title: "项目编号",
              key: "xmbh",
              width: 150,
              align: "center"
            },
            {
              title: "项目名称",
              key: "xmmc",
              width: 200,
              align: "center",
              tooltip: true
            },
            {
              title: "项目阶段",
              key: "xmjd",
              width: 100,
              align: "center"
            },
            {
              title: "专业",
              key: "zy",
              width: 100,
              align: "center"
            },
            {
              title: "坐落地址",
              key: "zldz",
              width: 200,
              align: "center",
              tooltip: true
            },
            {
              title: "设计单位",
              key: "sjdw",
              width: 200,
              align: "center",
              tooltip: true
            },
            {
              title: "申报单位",
              key: "sbdw",
              width: 200,
              align: "center",
              tooltip: true
            },
            {
              title: "申报日期",
              key: "sbrq",
              width: 100,
              align: "center"
            },
            {
              title: "审批日期",
              key: "sprq",
              width: 100,
              align: "center"
            },
            {
              title: "办理状态",
              key: "sbzt",
              width: 100,
              align: "center"
            },
            {
              title: "备注",
              key: "bz",
              width: 100,
              align: "center",
              tooltip: true
            },
            downLoadField
          ];
          break;
      }
      //根据画的geometry查询要素涉及的项目编号
      await this.getFeaturebyGeom(newGeometryWKT);
    }
  }
};
</script>

<style scoped>
.search {
  width: 500px;
  height: 750px;
}
.keyword-search > * {
  margin-left: 10px;
}
.search-divider span {
  color: white;
}
.spatial-search {
  margin-top: 30px;
}
.spatial-search {
  text-align: center;
}
.spatial-search > * {
  margin-left: 20px;
}
.info-table {
  margin: 0 auto;
}
.search-none-info p {
  text-align: center;
  font-size: 20px;
  color: white;
}
.demo-spin-col {
  height: 400px;
  position: relative;
  border: 1px solid #eee;
}
.button-clear {
  margin-top: 20px;
}
.page {
  margin: 10px;
  color: white;
}
</style>
