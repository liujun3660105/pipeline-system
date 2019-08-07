<template>
    <div class="collide">
      <Row :gutter="50" class="item-row">
        <i-col span="12">
          <Row class="item-item-row" >
            <i-col span="18">
              <span class="info-title">
          请选择上传数据的数据格式:
        </span>
            </i-col>
            <i-col span="6">
              <Select v-model="dataType" style="width:100px">
                <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </i-col>
          </Row>
          <Row class="item-item-row" >
            <i-col span="18">
              <span class="info-title">
          请选择上传数据的坐标系:
        </span>
            </i-col>
            <i-col span="6">
              <Select v-model="coorType" style="width:100px">
                <Option v-for="item in coorTypeList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
              </Select>
            </i-col>
          </Row>
        </i-col>
        <i-col span="12">
          <div class="upload-item">
            <Upload ref="upload"
              action="//jsonplaceholder.typicode.com/poss/"
              :format='format'
              :accept="accept"
              :max-size="maxSize"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleSizeError"
              :before-upload="handleBeforeUpload"
            >
              <Button :disabled="startUpload" icon="ios-cloud-upload-outline">请选择上传文件</Button>
            </Upload>
            <div class="upload-info"  v-if="file !== null">Upload file: {{ file.name }} <Button  @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>
          </div>
        </i-col>

      </Row>
      <Row :gutter="50" class="item-row">
        <i-col span="8" class="gxinfo-col">
          <span class="gxinfo-title">
            请选择管线类别
          </span>
          <Cascader :data="gxinfoList" trigger="hover" v-model="gxinfo" :disabled="gxTypeEnable"></Cascader>
        </i-col>
        <i-col span="8" class="gxinfo-col">
          <span class="gxinfo-title">
            请输入管径(mm)
          </span>
          <InputNumber :step="100" :min="0" v-model="gj" :editable="false" :disabled="gxTypeEnable"></InputNumber>
        </i-col>
        <i-col span="8" class="gxinfo-col">
          <Button :disabled="analyzeEnable" icon="logo-steam" @click="startAnalyze">开始分析</Button>
        </i-col>

      </Row>
      <Row :gutter="0" class="item-row">
        <Table  @on-row-dblclick="selectRow" class="info-table"  height="200" :columns="gxInfoColumns" :data="gxInfoData"/>
      </Row>
    </div>
</template>

<script>
  import {getUploadGeometry,getAnalyzeGeometry} from '@/api/collide'
  import {mapMutations} from 'vuex'
    export default {
        name: "Collide",
      data(){
          return {
            maxSize:5120,
            dataType:'',
            coorType:'',
            dataTypeList:[
              {value:'dwg',label:'CAD文件',format:'.dwg'},
              {value:'shp',label:'Shp文件',format:'.shp'}
            ],
            coorTypeList:[
              {value:'TJ90',label:'天津90'},
              {value:'CGCS2000',label:'国家2000'},
              {value:'WGS84',label:'WGS84'},
              {value:'GCJ-02',label:'火星坐标系'}
            ],
            file: null,
            // format:"['']",
            // accept:'',
            loadingStatus: false,
            gxInfoColumns: [
              {
                title: '编号',
                key: 'xmbm',
                width:150,
                align:'center'
              },
              {
                title: '冲突管线编号',
                key: 'conflictid',
                width:150,
                tooltip:true,
                align:'center'
              },
              {
                title: '冲突管线类型',
                key: 'zy',
                width:190,
                align:'center'
              },
              {
                title: '冲突管线长度',
                key: 'length',
                width:200,
                align:'center'
              }
            ],
            gxInfoData: [
            ],
            gxinfoList: [
              {value: 'JS', label: '给水'},
              {value: 'PS', label: '排水'},
              {value: 'ZS', label: '中水'},
              {
                value: 'RQ', label: '燃气', children: [{
                  value: '低压', label: '低压'
                },
                  {
                    value: '中压', label: '中压'
                  },
                  {
                    value: '次高压', label: '次高压'
                  }
                ]
              },
              {value: 'RL', label: '热力'},
              {
                value: 'DL', label: '电力', children: [
                  {
                    value: '<35kV', label: '<35kV', children: [
                      {value: '直埋', label: '直埋'},
                      {value: '其它', label: '其它'}
                    ]
                  },
                  {
                    value: '>=35kV', label: '>=35kV', children: [
                      {value: '直埋', label: '直埋'},
                      {value: '其它', label: '其它'}
                    ]
                  },
                ]
              },
              {value: 'DX', label: '电信',children:[
                  {value: '直埋', label: '直埋'},
                  {value: '其它', label: '其它'}
                ]}

            ],
            gxinfo:[],
            gj:0,
            gxTypeEnable:true,
            uploadGeoJsonStr:''
          }
      },
      computed:{
        format(){
            if(this.dataType){
              return new Array(this.dataType);
              // let index=this.dataTypeList.findIndex((item)=>{
              //   return item.value===this.dataType
              // });
              // console.log(new Array(this.dataTypeList[index].format));
              // return new Array(this.dataTypeList[index].format);
            }
            else{
              return new Array("")
            }

          },
        accept(){
          if(this.dataType){
            let index=this.dataTypeList.findIndex((item)=>{
              return item.value===this.dataType
            });
            return this.dataTypeList[index].format
          }
          else{
            return ''
          }

        },
        startUpload(){
            return !(this.dataType && this.coorType);
        },
        analyzeEnable(){
          return !(this.gxinfo.length>0&&this.gj>0)
        },
        //拼凑管线数组[zy,gj,ylz,msfs,gjvalue]
        gxInfoAllStr(){
          var returnInfo=[];
          var gj='';
         console.log(this.gxinfo[0]);
          switch (this.gxinfo[0]){
            case 'JS':
              gj=this.gj<=200?'<=200':'>200';
              returnInfo=[this.gxinfo[0],gj,'','',this.gj];
              break;
            case 'PS':
              returnInfo=[this.gxinfo[0],'','','',this.gj];
              break;
            case 'ZS':
              returnInfo=[this.gxinfo[0],'','','',this.gj];
              break;
            case 'RQ':
              gj=this.gj<=300?'<=300':'>300';
              returnInfo=[this.gxinfo[0],gj,this.gxinfo[1],'',this.gj];
              break;
            case 'RL':
              returnInfo=[this.gxinfo[0],'','','',this.gj];
              break;
            case 'DL':
              returnInfo=[this.gxinfo[0],'',this.gxinfo[1],this.gxinfo[2],this.gj];
              break;
          }
          return returnInfo.join(',');
        }
      },
      methods:{
          ...mapMutations([
            'featuresChange',
            'DbClickRowXmIdChange'
          ]),
        handleBeforeUpload (file) {
          let fileSuffix=this.getFileSuffix(file.name);
          if(fileSuffix===this.dataType&&file.size<=this.maxSize*1024){
            this.file=file;
          }
           // return false;
        },
        upload () {
          let config={
            headers:{
              'Content-Type':'multipart/form-data:boundary='+new Date().getTime()
            }
          };
          let formData=new FormData();
          formData.append('file',this.file);
          formData.append('coortype',this.coorType);
            getUploadGeometry(formData).then((res)=>{
              //注意这里返回的数据和select组件中返回的数据不一样，这里返回的是["{}"]
              //select 返回的是[{}]
              console.log(res);
              this.uploadGeoJsonStr=res.data.data;//后面分析的时候需要用
              let geoJsonResult=JSON.parse(res.data.data);
              this.featuresChange(geoJsonResult);
              this.gxTypeEnable=false;
            });
            this.file = null;
            this.loadingStatus = false;
            this.$Message.success('Success');
        },
        handleFormatError (file) {
          this.$Notice.warning({
            title: '数据格式不正确',
            desc: '文件 ' + file.name + ' 的格式不正确，请选择'+this.dataType+'文件.'
          });
        },
        handleSizeError(file){
          this.$Notice.warning({
            title: '数据过大',
            desc: '文件 ' + file.name + ' 过大, 请上传不超过5M的文件'
          });
        },
        selectRow(val,index){
            console.log(val);
          this.$store.commit('DbClickRowXmIdChange',val.xmbm);

        },
        getFileSuffix(fileName){
          let index=fileName.lastIndexOf(".");
          let fileNameLength=fileName.length;
          return fileName.substring(index+1,fileNameLength)
        },
        handleSuccess(){
          this.file=null;
          this.loadingStatus=false;
          this.$Message.success('上传成功');
        },
        handleError(){
          this.file=null;
          this.loadingStatus=false;
          this.$Message.error('上传失败');
        },
        startAnalyze(){
            //分别去除组织好的需要传的参数
          console.log(this.gxInfoAllStr);
          let gxInfoList=this.gxInfoAllStr.split(',');
          console.log(gxInfoList);
          let zy=gxInfoList[0];
          let gj=gxInfoList[1];
          let ylz=gxInfoList[2];
          let msfs=gxInfoList[3];
          let gjvalue=parseInt(gxInfoList[4]);
          getAnalyzeGeometry(this.uploadGeoJsonStr,zy,gj,ylz,msfs,gjvalue).then((res)=>{
            console.log(JSON.parse(res.data.data));
            let geoJsonResult=JSON.parse(res.data.data);
            this.featuresChange(geoJsonResult);
            let conflictLinesAttr=JSON.parse(res.data.data).features.map(x=>x.properties);
            this.gxInfoData=conflictLinesAttr;
          })



        }
      }
    }
</script>

<style scoped>

  .info-title{
    color:white;
    font-size:15px;
  }
  .item-row{
    margin-top:20px;
    border-bottom:solid 1px white;
    padding-bottom:10px;
  }
  .item-item-row{
    /*margin-top:20px;*/
    /*border-bottom:solid 1px white;*/
    padding-bottom:10px;
  }
  .upload-item{
    text-align: center;
  }
  .upload-info{
    color:white;
    font-size:15px;
  }
  .info-table{
    margin:auto 0;
  }
  .gxinfo-title{
    color:white;
    font-size:15px;
    display:block;
    text-align: center;
  }
  .gxinfo-col{
    text-align: center;
  }
</style>
