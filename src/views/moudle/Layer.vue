<template>
    <div class="layer">
      <Tree :data="data" ref="layerTree" show-checkbox @on-check-change="layerSelect"></Tree>
    </div>
</template>

<script>
  import TileWMS from 'ol/source/TileWMS'
  import TileLayer from 'ol/layer/Tile'
  import {mapGetters} from 'vuex'
    export default {
      name: "Search",
      //layer组件初始化数据，这里的layer是null，如果只在这里声明，并且补齐layer，在Map组件中map.addLayer时会与vuex发生冲突,max递归组件的错误。
      // 到目前仍未找到原因。目前的解决方案是把所有的图层都在Map组件声明（themeLayer），并设置为隐藏，然后全部添加到图层中
      //当Tree组件发生变化时，得到选择的所有图层 进行显示和隐藏的配置
      data() {
        return {
          data: [
            {
              title: '行政边界',
              expand: true,
              children:[
                {
                  title: '滨海新区边界',
                  value:'xqbj',
                  layer:null
                },
                {
                  title: '功能区边界',
                  value:'gnqbj',
                  layer:null
                },
                {
                  title: '街镇边界',
                  value:'jzbj',
                  layer:null
                }
              ]
            },
            {
              title: '管线数据',
              expand: false,
              children: [
                {
                  title: '普查管线',
                  expand: false,
                  children:[
                    {
                      title: '普查',
                      value:'pc',
                      layer:null
                    },
                    {
                      title: '调绘',
                      value:'dh',
                      layer:null
                    },
                    {
                      title: '示意',
                      value:'sy',
                      layer:null
                    }
                  ]
                },
                {
                  title: '物探管线',
                  value:'wt',
                  layer:null
                },
                {
                  title: '规划管线',
                  value:'xm',
                  layer:null
                }
              ]
            },
            {
              title: '交通数据',
              expand: true,
              children: [
                {
                  title: '规划轨道',
                  expand: true,
                  value: 'ghgd',
                  layer: null
                },
                {
                  title: '规划路网',
                  expand: true,
                  value: 'ghlw',
                  layer: null
                },

              ]
            },
            {
              title: '用地数据',
              expand: true,
              children:[
                {
                  title: '控规',
                  expand: true,
                  value:'kg',
                  layer:null
                },
                {
                  title: '土规',
                  expand: true,
                  value:'tg',
                  layer:null
                }
              ]
            },
            {
              title: '河道数据',
              expand: true,
              children:[
                {
                  title: '河道中心线',
                  expand: true,
                  value:'hdzxx',
                  layer:null
                },
                {
                  title: '河道蓝线',
                  expand: true,
                  value:'hdlx',
                  layer:null
                },
                {
                  title: '河道管理范围',
                  expand: true,
                  value:'hdglfw',
                  layer:null
                }

              ]
            },
            {

            }


          ]
        }
      },
      computed:{
        ...mapGetters([
          'getAccessLayers'
        ])
      },
      methods:{
         //过滤所有选择的图层，得到所有最底层节点图层
        layerSelect(data){
          // console.log(this.$store.state.layer);
          let layers=data;
          let newLayers=[];
          for(let index in layers){
            if(!layers[index].hasOwnProperty('children')){
                newLayers.push(layers[index]);
            }
          }
          // 修改vuex中layer模块的Layer数据，在Map组件中会有接收
          this.$store.commit('layerChange',newLayers);
        }

      },
      created(){
        this.data=this.getAccessLayers;
      }
    }
</script>

<style scoped>
  .layer{
    height:500px;
    width:250px;
    overflow:auto;
  }



</style>
