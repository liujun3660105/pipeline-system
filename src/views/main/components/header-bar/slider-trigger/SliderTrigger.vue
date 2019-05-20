<template>
    <Icon @click="collapeSlider" :class="rotateIcon" :type="icon" :size="size"></Icon>
</template>

<script>
    export default {
        name: "SliderTrigger",
      props:{
        isCollapsed:{
          type:Boolean
        },
        icon: {
          type: String,
          default: 'md-menu'
        },
        size: {
          type: Number,
          default: 26
        }

      },
      methods:{
          collapeSlider(){
            this.$emit('slider-collape',!this.isCollapsed);
          }
      },
      computed:{
          rotateIcon(){
            return [
              'icon-position',
              'menu-icon',
              this.isCollapsed ? 'rotate-icon' : ''
            ]
          }
      }
    }
</script>

<style scoped>
  .rotate-icon{
    transform:rotate(-90deg);
  }
  .menu-icon{
    transform:all .3s;
  }
  .icon-position{
    cursor:pointer;
  }
</style>
