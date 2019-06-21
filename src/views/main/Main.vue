<template>
  <Layout class="layout">
    <Header class="header">
      <h1>天津市滨海新区地下管线综合管理系统</h1>
    </Header>
    <Layout class="main-body">
      <Sider hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" >
        <Menu active-name="Layer" theme="dark"  width="auto" :class="menuitemClasses" @on-select="showOperationModal">
          <MenuItem v-for="(item,index) in moduleList" :name="item.name" :key="item.id">
            <Icon :type="item.icon"></Icon>
            <span>{{item.title}}</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header class="header-con" >
          <HeaderBar :collapsed="isCollapsed" @on-coll-change="handleCollapsedChange">
            <FullScreen v-model="isFullScreen" style="margin-right: 10px;"></FullScreen>
            <UserInfo></UserInfo>
          </HeaderBar>
        </Header>
        <Content >
          <Map class="mapContainer"></Map>
          <Modal id="modal-module" ref="modal" v-model="modal1" :footer-hide=true :draggable=true :width="width" >
            <div slot="header" class="modal-title">{{moduleTitle}}</div>
            <keep-alive>
              <component :is="currentView"></component>
            </keep-alive>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  </Layout>
</template>

<script>
  import HeaderBar from './components/header-bar'
  import FullScreen from './components/fullscreen'
  import UserInfo from './components/userinfo'
  import {Layer,Search,Statistic,Collide,Distance,Connection} from '../moudle'
  import Map from '../map'
  import {mapGetters} from 'vuex'

    export default {
        name: "Main",
      components: {
        HeaderBar,
        FullScreen,
        UserInfo,
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
            // {
            //   id: 1,
            //   title: '图层控制',
            //   name: 'Layer',
            //   icon: 'logo-buffer'
            // },
            // {
            //   id: 2,
            //   title: '查询分析',
            //   name: 'Search',
            //   icon: 'ios-search'
            // },
            // {
            //   id: 3,
            //   title: '统计分析',
            //   name: 'Statistic',
            //   icon: 'md-stats'
            // },
            // {
            //   id: 4,
            //   title: '碰撞分析',
            //   name: 'Collide',
            //   icon: 'md-shuffle'
            // },
            // {
            //   id: 5,
            //   title: '净距分析',
            //   name: 'Distance',
            //   icon: 'md-pause'
            // },
            // {
            //   id: 6,
            //   title: '连通分析',
            //   name: 'Connection',
            //   icon: 'logo-steam'
            // }
          ],
          currentView:'',
          width:''
        }
      },
      methods:{
        handleCollapsedChange (state) {
          this.isCollapsed = state
        },
        //Modal里
        showOperationModal(name){
          this.modal1=true;
          this.currentView=name;
          switch (name){
            case 'Layer':
              this.width='250';
              break;
            case 'Search':
              this.width='500';
              break;
            case 'Statistic':
              this.width='500';
              break;
            case 'Collide':
              this.width='500';
              break;
            case 'Distance':
              this.width='500';
              break;
            case 'Connection':
              this.width='200';
              break;
          }
        }
      },
      computed: {
        menuitemClasses: function () {
          return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : ''
          ]
        },
        moduleTitle() {
          if (this.currentView) {
            let index = this.moduleList.findIndex((val, index, arr) => {
              return val.name === this.currentView;
            });
            return this.moduleList[index].title
          }

        },
        ...mapGetters([
          'getAccessModules'
        ])
      },
      created() {
        this.moduleList = this.getAccessModules;
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
