<template>

  <Layout class="layout">
    <Header class="header">
      <h1>天津市滨海新区地下管线综合管理系统</h1>
    </Header>
    <Layout class="main-body">
      <Sider hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" >
        <Menu active-name="Layer" theme="dark"  width="auto" :class="menuitemClasses" @on-select="showOperationModal">
          <MenuItem name="Layer">
            <Icon type="logo-buffer" />
            <span>图层控制</span>
          </MenuItem>
          <MenuItem name="Search">
            <Icon type="ios-search" />
            <span>查询分析</span>
          </MenuItem>
          <MenuItem name="Statistic">
            <Icon type="md-stats" />
            <span>统计分析</span>
          </MenuItem>
          <MenuItem name="Collide">
            <Icon type="md-shuffle" />
            <span>碰撞分析</span>
          </MenuItem>
          <MenuItem name="Distance">
            <Icon type="md-pause" />
            <span>净距分析</span>
          </MenuItem>
          <MenuItem name="Connection">
            <Icon type="logo-steam" />
            <span>连通性析</span>
          </MenuItem>
        </Menu>
        <!--<ModalItem :value="itemID" :width="width">-->
          <!--<div slot="header">标题</div>-->
          <!--<p>这里是内容</p>-->

        <!--</ModalItem>-->
        <!--<Modal v-model="itemID">-->
          <!--<div slot="header">{{this.itemID}}</div>-->
        <!--</Modal>-->
      </Sider>
      <Layout>
        <Header class="header-con" >
          <HeaderBar :collapsed="isCollapsed" @on-coll-change="handleCollapsedChange">
            <FullScreen v-model="isFullScreen" style="margin-right: 10px;"></FullScreen>
          </HeaderBar>
        </Header>
        <Content >
          <Map class="mapContainer"></Map>

          <Modal id="modal-module" ref="modal" v-model="modal1" :footer-hide=true :draggable=true class-name="modal-style">
            <div slot="header" class="modal-title">{{moduleTitle}}</div>
            <component :is="currentView"></component>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  </Layout>
</template>

<script>
  import HeaderBar from './components/header-bar'
  import FullScreen from './components/fullscreen'
  import LegendControl from './components/legend-control'
  import {Layer,Search,Statistic,Collide,Distance,Connection} from '../moudle'
  import Map from '../map'
  // import DialogModal from '@/components/dialog-modal'
    export default {
        name: "Main",
      components: {
        HeaderBar,
        FullScreen,
        LegendControl,
        Layer, Search,Statistic,Collide,Distance,Connection,
        Map
      },
      data(){
        return {
          isCollapsed: false,
          isFullScreen:false,
          itemID:'',
          width:500,
          modal1:false,
          moduleList:[
            {
            title:'图层控制',
            name:'Layer'
          },
            {
              title:'查询分析',
              name:'Search'
            },
            {
              title:'统计分析',
              name:'Statistic'
            },
            {
              title:'碰撞分析',
              name:'Collide'
            },
            {
              title:'净距分析',
              name:'Distance'
            },
            {
              title:'连通分析',
              name:'Connection'
            }
          ],
          currentView:''
        }
      },
      methods:{
        handleCollapsedChange (state) {
          this.isCollapsed = state
        },
        showOperationModal(name){
          this.modal1=true;
          this.currentView=name;


          // this.$Modal.info({
          //
          //   render:(h)=>{
          //     return h(Search)
          //   }
          // })


        }
      },
      computed: {
        menuitemClasses: function () {
          return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : ''
          ]
        },
        moduleTitle(){
          if(this.currentView){
            let index=this.moduleList.findIndex((val,index,arr)=>{
              return val.name==this.currentView;
            });
            return this.moduleList[index].title
          }

        }

      }
    }
</script>

<style scoped lang="less">
  h1{
    color:white;
  }
  .layout{
    height:100%;
  }
  .main-body{
    height:100%;
  }
  .layout-con{
    height: 100%;
    width: 100%;
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }

  .header-con{
    background: #fff;
    padding: 0 20px;
    width: 100%;
  }
.header{
  background-color:#1d1c10
}
.modal-title{
  color:white;
  font-size:10px;
}


  /*.modal-style{*/
    /*background-color:blue;*/
  /*}*/
  /*#modal-module{*/
    /*background-color:blue;*/
  /*}*/
</style>
