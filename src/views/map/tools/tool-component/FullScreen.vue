<template>
  <div>
    <a @click="fullScreenChange">全屏缩放<Icon :type="value ? 'md-contract' : 'md-expand'" size="25"></Icon></a>
  </div>
</template>

<script>
  import ready from '@/mixins/ready';
    export default {
      name: "FullScreen",
      mixins: [ready],
      data(){
        return {
          elem:null
        }
      },
      props:{
        value:{
          type:Boolean,
          default:false
        }
      },
      methods:{
        _load(){
          this.elem = this.map.getTargetElement();
          document.addEventListener('fullscreenchange', () => {
            console.log('fullscreenchange');
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
          });
          document.addEventListener('mozfullscreenchange', () => {
            console.log('fullscreenchange');
            this.$emit('input', !this.value)
            this.$emit('on-change', !this.value)
          });
          document.addEventListener('webkitfullscreenchange', () => {
            console.log('fullscreenchange');
            this.$emit('input', !this.value)
            this.$emit('on-change', !this.value)
          });
          document.addEventListener('msfullscreenchange', () => {
            console.log('fullscreenchange');
            this.$emit('input', !this.value)
            this.$emit('on-change', !this.value)
          });
          // this.$emit('input', this.isFullScreen);
        },
        requestFullScreen(element){
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          }
        },
        exitFullScreen(){
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        },
        fullScreenChange(){
          if(this.value){
            this.exitFullScreen();
          }
          else{

            this.requestFullScreen(this.elem);
          }
        }
      }
    }
</script>

<style scoped>
  .tools-ul li a{
    color:white;
    font-size:15px;
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 25px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: -5px;
    display: inline-block;
  }
</style>
