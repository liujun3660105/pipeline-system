<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',

}
</script>

<style>
  html,body{
    height:100%;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height:100%;
}
  .ivu-modal-content {
    background:rgba(0,0,0,0.5);
  }
  .ivu-modal-body{
    padding:0px;
  }
  .ol-mouse-position{
    font-size:20px;
  }
  .ivu-tree-arrow{
    color:white;
  }
  .ivu-tree-title{
    color:white;
    font-size:20px;
  }
  .ivu-icon{
    /*color:white;*/
  }
  .ivu-tree-title-selected{
    background-color: #7ef1fb;
  }
  .ivu-tree-title:hover{
    background-color: #7ef1fb;
  }

  @font-face {
    font-family: 'iconfont';  /* project id 1155260 */
    src: url('//at.alicdn.com/t/font_1155260_3dauw3ta5k4.eot');
    src: url('//at.alicdn.com/t/font_1155260_3dauw3ta5k4.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1155260_3dauw3ta5k4.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1155260_3dauw3ta5k4.woff') format('woff'),
    url('//at.alicdn.com/t/font_1155260_3dauw3ta5k4.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1155260_3dauw3ta5k4.svg#iconfont') format('svg');
  }

  .tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
  }
  .tooltip-measure {
    opacity: 1;
    font-weight: bold;
  }
  .tooltip-static {
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
  }
  .tooltip-measure:before,
  .tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
  }
  .ivu-divider-inner-text{
    color:white;
  }

</style>
