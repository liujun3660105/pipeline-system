<template>
    <div class="search">
      <Divider dashed>属性查询</Divider>
      <div class="keyword-search">
        <Input v-model="keyWord" placeholder="请输入查询的关键字" style="width: 250px"/>
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
        <Table v-if="isShownTableContent" @on-row-dblclick="selectRow" class="info-table" width="490" height="200" :columns="xmInfoColumns" :data="xmInfo"></Table>
        <div v-else class="table-await">
          <Col class="demo-spin-col" span="26">
            <Spin fix>
              <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
              <div>Loading</div>
            </Spin>
          </Col>
        </div>

      </div>
      <div class="search-none-info" v-else>
        <p>暂无数据</p>
      </div>
      <Button  class="button-clear" icon="md-close-circle" @click="clear">清空</Button>
    </div>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'
    export default {
        name: "Search",
        data(){
          return {
            keyWord:'',
            keyWordType:'',
            ghInfoList:[
              {value:'snsj',label:'所内设计'},
              {value:'snsc',label:'所内审查'},
              {value:'ysp',label:'已审批'}
            ],
            spatialSelectedType:'',
            xmInfoColumns: [
            ],
            xmInfo: [
            ],
            columnWidth:100,
            isShownTable:false,
            isShownTableContent:false,
            isDraw:false,
            searchFlag:true
          }
      },
      computed:{
        getKeyWord(){
          return this.$store.state.search.searchParams;
        },
        getDrawEnable(){
          return this.$store.state.draw.isDraw;
        },
        getDrawGeometry(){
          return this.$store.state.search.geomWKT;
        }
      },
        methods:{
          ...mapMutations('draw',[
            'isDrawChange',
            'moduleTypeChange'
          ]),
        searchByKeyWord(){
          if(this.keyWordType){

            //修改初始值和vuex中search.js的searchParams
            this.isShownTable=true;//显示表格
            this.$store.commit('keyWordChange', {
              searchKeyWord: this.keyWord,
              searchType: this.keyWordType
            });
            this.isShownTableContent=false;//显示表格内容
            //设置表头
            switch (this.keyWordType){
              case 'snsj':
                this.xmInfoColumns=[
                  {
                    title: '项目编号',
                    key: 'xmbh',
                    width:150,
                    align:'center'
                  },
                  {
                    title: '项目名称',
                    key: 'xmmc',
                    width:200,
                    tooltip:true,
                    align:'center'
                  },
                  {
                    title: '专业',
                    key: 'zy',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '设计人',
                    key: 'sjr',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '设计日期',
                    key: 'sjrq',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '备注',
                    key: 'bz',
                    width:100,
                    tooltip:true,
                    align:'center'
                  }
                ];
                break;
              case 'snsc':
                this.xmInfoColumns=[
                  {
                    title: '项目编号',
                    key: 'xmbh',
                    width:150,
                    align:'center'
                  },
                  {
                    title: '项目名称',
                    key: 'xmmc',
                    width:200,
                    tooltip:true,
                    align:'center'
                  },
                  {
                    title: '项目阶段',
                    key: 'xmjd',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '专业',
                    key: 'zy',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '审查人',
                    key: 'scr',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '发件人',
                    key: 'sjr',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '接收日期',
                    key: 'sjrq',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '回复日期',
                    key: 'hfrq',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '回复情况',
                    key: 'hfqk',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '设计单位',
                    key: 'sjdw',
                    width:100,
                    align:'center',
                    tooltip:true
                  },
                  {
                    title: '备注',
                    key: 'bz',
                    width:100,
                    align:'center',
                    tooltip:true
                  }
                ];
                break;
              case 'ysp':
                this.xmInfoColumns=[
                  {
                    title: '申请编号',
                    key: 'sqbh',
                    width:200,
                    align:'center'
                  },
                  {
                    title: '项目编号',
                    key: 'xmbh',
                    width:150,
                    align:'center'
                  },
                  {
                    title: '项目名称',
                    key: 'xmmc',
                    width:200,
                    align:'center',
                    tooltip:true
                  },
                  {
                    title: '项目阶段',
                    key: 'xmjd',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '专业',
                    key: 'zy',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '坐落地址',
                    key: 'zldz',
                    width:200,
                    align:'center',
                    tooltip:true
                  },
                  {
                    title: '设计单位',
                    key: 'sjdw',
                    width:200,
                    align:'center',
                    tooltip:true
                  },
                  {
                    title: '申报单位',
                    key: 'sbdw',
                    width:200,
                    align:'center',
                    tooltip:true
                  },
                  {
                    title: '申报日期',
                    key: 'sbrq',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '审批日期',
                    key: 'sprq',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '办理状态',
                    key: 'sbzt',
                    width:100,
                    align:'center'
                  },
                  {
                    title: '备注',
                    key: 'bz',
                    width:100,
                    align:'center',
                    tooltip:true
                  }
                ];
                break;
            }
            //项目查询
            this.$axios.get('/searchxminfobykeyword',{
              params: {
                keyWord: this.keyWord,
                keyWordType: this.keyWordType
              }
            }).then((res)=>{
              this.isShownTableContent=true;
              this.xmInfo=res.data.data;
            }).catch((err)=>{

            })

            //要素查询
            this.$axios.get('/searchfeaturebykeyword',{
              params: {
                keyWord: this.keyWord,
                keyWordType:this.keyWordType
              }
            }).then((res)=>{
              this.$store.commit('featuresChange',res.data.data[0]);

              // if(res.data.data[0].features){
              //   this.$store.commit('featuresChange',res.data.data[0]);
              // }
            }).catch((err)=>{
            })
          }
          else{
            this.$Message.warning({
              content:'请选择搜索的项目类型！',
              duration:1
            });
          }
        },
        searchByPolygonGeometry(){
          if(this.spatialSelectedType){
            this.keyWordType='';
            this.isDraw=true;//设置按钮不可用
            this.isDrawChange(true);//开启画图
            this.moduleTypeChange('search');//设置vuex中draw模块的moduletype值告诉DrawGeometry是查询模块调用画图工具
          }
          else{
            this.$Message.warning({
              content:'请选择搜索的项目类型！',
              duration:1
            });
          }
        },
        clear(){
          this.isShownTable=false;
          this.$store.commit('featuresChange',[]);
        },
        selectRow(val,index){
          this.$store.commit('DbClickRowXmIdChange',val.xmbh);
        },
      },
      watch:{
          //属性查询
          //如果vuex中search.js的searchParams发生变化，则进行项目信息查询和相关要素查询
        //前期想当时用户有可能在不改动keyword和keywordtype情况下连续点击两次查询按钮，则为了提高效率，不进行重新查询
        //但是此时如果空间查询或者清除后，再次点击属性查询，由于keyword和keywordtype都没有发生变化，则不进行查询，所以放弃，直接写在按钮事件里
        getKeyWord:{
          handler(newObject,oldObject){
            // this.isShownTableContent=false;//显示表格内容
            // //设置表头
            // switch (this.keyWordType){
            //   case 'snsj':
            //     this.xmInfoColumns=[
            //       {
            //         title: '项目编号',
            //         key: 'xmbh',
            //         width:150,
            //         align:'center'
            //       },
            //       {
            //         title: '项目名称',
            //         key: 'xmmc',
            //         width:200,
            //         tooltip:true,
            //         align:'center'
            //       },
            //       {
            //         title: '专业',
            //         key: 'zy',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '设计人',
            //         key: 'sjr',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '设计日期',
            //         key: 'sjrq',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '备注',
            //         key: 'bz',
            //         width:100,
            //         tooltip:true,
            //         align:'center'
            //       }
            //     ];
            //     break;
            //   case 'snsc':
            //     this.xmInfoColumns=[
            //       {
            //         title: '项目编号',
            //         key: 'xmbh',
            //         width:150,
            //         align:'center'
            //       },
            //       {
            //         title: '项目名称',
            //         key: 'xmmc',
            //         width:200,
            //         tooltip:true,
            //         align:'center'
            //       },
            //       {
            //         title: '项目阶段',
            //         key: 'xmjd',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '专业',
            //         key: 'zy',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '审查人',
            //         key: 'scr',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '发件人',
            //         key: 'sjr',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '接收日期',
            //         key: 'sjrq',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '回复日期',
            //         key: 'hfrq',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '回复情况',
            //         key: 'hfqk',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '设计单位',
            //         key: 'sjdw',
            //         width:100,
            //         align:'center',
            //         tooltip:true
            //       },
            //       {
            //         title: '备注',
            //         key: 'bz',
            //         width:100,
            //         align:'center',
            //         tooltip:true
            //       }
            //     ];
            //     break;
            //   case 'ysp':
            //     this.xmInfoColumns=[
            //       {
            //         title: '申请编号',
            //         key: 'sqbh',
            //         width:200,
            //         align:'center'
            //       },
            //       {
            //         title: '项目编号',
            //         key: 'xmbh',
            //         width:150,
            //         align:'center'
            //       },
            //       {
            //         title: '项目名称',
            //         key: 'xmmc',
            //         width:200,
            //         align:'center',
            //         tooltip:true
            //       },
            //       {
            //         title: '项目阶段',
            //         key: 'xmjd',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '专业',
            //         key: 'zy',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '坐落地址',
            //         key: 'zldz',
            //         width:200,
            //         align:'center',
            //         tooltip:true
            //       },
            //       {
            //         title: '设计单位',
            //         key: 'sjdw',
            //         width:200,
            //         align:'center',
            //         tooltip:true
            //       },
            //       {
            //         title: '申报单位',
            //         key: 'sbdw',
            //         width:200,
            //         align:'center',
            //         tooltip:true
            //       },
            //       {
            //         title: '申报日期',
            //         key: 'sbrq',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '审批日期',
            //         key: 'sprq',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '办理状态',
            //         key: 'sbzt',
            //         width:100,
            //         align:'center'
            //       },
            //       {
            //         title: '备注',
            //         key: 'bz',
            //         width:100,
            //         align:'center',
            //         tooltip:true
            //       }
            //     ];
            //     break;
            // }
            // //项目查询
            // this.$axios.get(this.HOST+'/searchxminfobykeyword',{
            //   params: {
            //     keyWord: this.keyWord,
            //     keyWordType: this.keyWordType
            //   }
            // }).then((data)=>{
            //   this.isShownTableContent=true;
            //   this.xmInfo=data.data;
            // }).catch((err)=>{
            //   console.log(err);
            // })
            //
            // //要素查询
            // this.$axios.get(this.HOST+'/searchfeaturebykeyword',{
            //   params: {
            //     keyWord: newObject.searchKeyWord,
            //     keyWordType:newObject.searchType
            //   }
            // }).then((data)=>{
            //   if(data.data[0].features){
            //     this.$store.commit('featuresChange',data.data[0]);
            //     // this.addSelectedFeaturesToMap();
            //   }
            // }).catch((err)=>{
            //   console.log(err);
            // })
          },
          deep:true
        },
        // keyWord(newValue){
        //   if(this.keyWordType()){
        //     this.$store.commit('keyWordChange',{
        //       searchKeyWord:this.keyWord,
        //       searchType:this.keyWordType
        //     });
        //   }
        // },
        // keyWordType(newValue){
        //   if(newValue){
        //     this.$store.commit('keyWordChange',{
        //       searchKeyWord:this.keyWord,
        //       searchType:this.keyWordType
        //     });
        //   }
        // }
        getDrawEnable(newEnable){
          this.isDraw=newEnable;
        },
        getDrawGeometry(newGeometryWKT){
          this.isShownTable=true;//显示表格
          this.isShownTableContent=false;//显示等待
          //设置表头
          switch (this.spatialSelectedType){
            case 'snsj':
              this.xmInfoColumns=[
                {
                  title: '项目编号',
                  key: 'xmbh',
                  width:150,
                  align:'center'
                },
                {
                  title: '项目名称',
                  key: 'xmmc',
                  width:200,
                  tooltip:true,
                  align:'center'
                },
                {
                  title: '专业',
                  key: 'zy',
                  width:100,
                  align:'center'
                },
                {
                  title: '设计人',
                  key: 'sjr',
                  width:100,
                  align:'center'
                },
                {
                  title: '设计日期',
                  key: 'sjrq',
                  width:100,
                  align:'center'
                },
                {
                  title: '备注',
                  key: 'bz',
                  width:100,
                  tooltip:true,
                  align:'center'
                }
              ];
              break;
            case 'snsc':
              this.xmInfoColumns=[
                {
                  title: '项目编号',
                  key: 'xmbh',
                  width:150,
                  align:'center'
                },
                {
                  title: '项目名称',
                  key: 'xmmc',
                  width:200,
                  tooltip:true,
                  align:'center'
                },
                {
                  title: '项目阶段',
                  key: 'xmjd',
                  width:100,
                  align:'center'
                },
                {
                  title: '专业',
                  key: 'zy',
                  width:100,
                  align:'center'
                },
                {
                  title: '审查人',
                  key: 'scr',
                  width:100,
                  align:'center'
                },
                {
                  title: '发件人',
                  key: 'sjr',
                  width:100,
                  align:'center'
                },
                {
                  title: '接收日期',
                  key: 'sjrq',
                  width:100,
                  align:'center'
                },
                {
                  title: '回复日期',
                  key: 'hfrq',
                  width:100,
                  align:'center'
                },
                {
                  title: '回复情况',
                  key: 'hfqk',
                  width:100,
                  align:'center'
                },
                {
                  title: '设计单位',
                  key: 'sjdw',
                  width:100,
                  align:'center',
                  tooltip:true
                },
                {
                  title: '备注',
                  key: 'bz',
                  width:100,
                  align:'center',
                  tooltip:true
                }
              ];
              break;
            case 'ysp':
              this.xmInfoColumns=[
                {
                  title: '申请编号',
                  key: 'sqbh',
                  width:200,
                  align:'center'
                },
                {
                  title: '项目编号',
                  key: 'xmbh',
                  width:150,
                  align:'center'
                },
                {
                  title: '项目名称',
                  key: 'xmmc',
                  width:200,
                  align:'center',
                  tooltip:true
                },
                {
                  title: '项目阶段',
                  key: 'xmjd',
                  width:100,
                  align:'center'
                },
                {
                  title: '专业',
                  key: 'zy',
                  width:100,
                  align:'center'
                },
                {
                  title: '坐落地址',
                  key: 'zldz',
                  width:200,
                  align:'center',
                  tooltip:true
                },
                {
                  title: '设计单位',
                  key: 'sjdw',
                  width:200,
                  align:'center',
                  tooltip:true
                },
                {
                  title: '申报单位',
                  key: 'sbdw',
                  width:200,
                  align:'center',
                  tooltip:true
                },
                {
                  title: '申报日期',
                  key: 'sbrq',
                  width:100,
                  align:'center'
                },
                {
                  title: '审批日期',
                  key: 'sprq',
                  width:100,
                  align:'center'
                },
                {
                  title: '办理状态',
                  key: 'sbzt',
                  width:100,
                  align:'center'
                },
                {
                  title: '备注',
                  key: 'bz',
                  width:100,
                  align:'center',
                  tooltip:true
                }
              ];
              break;
          }
          //根据画的geometry查询要素涉及的项目编号
          this.$axios.get('/getidbygeom',{
            params:{
              drawGeometry:newGeometryWKT,
              searchType:this.spatialSelectedType
            }
          }).then((res)=>{
            //对获得的项目编号进行拼凑[2018,2019]=>"'2018','2019'"
            var xmIdsParam
            var xmIds=[];
            if(res.data.data.length!==0){
              xmIds=res.data.data.map((val)=>{
                return "'"+val+"'"
              });
              xmIdsParam=xmIds.join(',')
            }
            else{
              xmIdsParam="'"+"'";
            }
            return xmIdsParam
          }).then(data=>{
            //根据得到的项目编号，对项目信息和涉及的要素进行查询
            //项目信息查询
            this.$axios.get('/searchxminfobyid',{
              params:{
                xmIds:data,
                searchType:this.spatialSelectedType
              }
            }).then(res=>{
              this.isShownTableContent=true;//显示表格内容
              this.xmInfo=res.data.data;
            });
            //要素信息查询
            this.$axios.get('/searchfeaturebyid',{
              params:{
                xmIds:data,
                searchType:this.spatialSelectedType
              }
            }).then(res=>{
                this.$store.commit('featuresChange',res.data.data[0]);
            });
          })

        }
      }
    }

</script>

<style scoped>
  .search{
    width:500px;
    height:500px;
  }
  .keyword-search>*{
    margin-left:10px;
  }
  .search-divider span{
    color:white;
  }
  .spatial-search{
    margin-top:30px;
  }
  .spatial-search{
    text-align:center;
  }
  .spatial-search>*{
    margin-left:20px;
  }
  .info-table{
    margin:0 auto;
  }
  .search-none-info p{
    text-align: center;
    font-size:20px;
    color:white;
  }
  .demo-spin-col{
    height: 200px;
    position: relative;
    border: 1px solid #eee;
  }
  .button-clear{
    margin-top:20px;
  }

</style>
