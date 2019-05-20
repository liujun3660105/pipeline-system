<template>
    <div class="layer">
      <Tree :data="data" ref="layerTree" show-checkbox @on-check-change="layerSelect"></Tree>
    </div>
</template>

<script>
  import TileWMS from 'ol/source/TileWMS'
  import TileLayer from 'ol/layer/Tile'
    export default {
      name: "Search",
      data() {
        return {
          data: [
            {
              title: '管线数据',
              expand: true,
              children: [
                {
                  title: '普查管线',
                  expand: true,
                  children:[
                    {
                      title: '普查',
                      expand: true,
                      value:'pc'
                    },
                    {
                      title: '调绘',
                      expand: true,
                      value:'dh',
                      layer:null
                    },
                    {
                      title: '示意',
                      expand: true,
                      value:'sy',
                      layer:null
                    }
                  ]
                },
                {
                  title: '物探管线',
                  expand: true,
                  value:'wt'
                },
                {
                  title: '规划管线',
                  expand: true,
                  layer:null
                }
              ]
            },
            {
              title: '路网',
              expand: true,
              children: [
                {
                  title: '道路中线',
                  expand: false,
                  layer:null

                },
                {
                  title: '道路红线',
                  expand: false,
                  layer:null
                }
              ]
            },
            {
              title: '控规',
              expand: true,
              layer:null
            }
          ]
        }
      },
      methods:{
        init(){
          //物探图层
          var prospectWMSLayer=new TileLayer({
            source:new TileWMS({
              url: 'http://localhost:8080/geoserver/pipeline/wms',
              params: {
                // 'FORMAT': 'jpg',
                // 'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": 'pipeline:prospectData',
                // "exceptions": 'application/vnd.ogc.se_inimage'
                // tilesOrigin: 93615.0703125 + "," + 236681.1875,
              },
              projection:'EPSG:4326'
            }),
            zIndex:2
          });
          //普查图层
          var pcWMSLayer =new TileLayer({
            source:new TileWMS({
              url: 'http://localhost:8080/geoserver/pipeline/wms',
              params: {
                // 'FORMAT': 'jpg',
                // 'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": 'pipeline:puchaData',
                // "exceptions": 'application/vnd.ogc.se_inimage'
                // tilesOrigin: 93615.0703125 + "," + 236681.1875,
              },
              projection:'EPSG:4326'
            }),
            zIndex:2
          });
          var xmWMSLayer;//项目图层
          //专题图层->管线图层->普查图层->普查
          // this.data[0].children[0].children[0].layer=pcWMSLayer;
          //专题图层->管线图层->物探图层
          // this.data[0].children[1].layer=prospectWMSLayer;
        },

        layerSelect(data){
          // console.log(this.$store.state.layer);
          let layers=data;
          let newLayers=[];
          for(let index in layers){
            if(!layers[index].hasOwnProperty('children')){
                newLayers.push(layers[index]);
            }
          }
          // console.log(newLayers);
          this.$store.commit('layerChange',newLayers);
        }
      },
      mounted(){
        this.init();

      },
      created(){
        // this.init();
      }
    }
</script>

<style scoped>
  .layer{
    width:500px;
    height:500px;
  }



</style>
