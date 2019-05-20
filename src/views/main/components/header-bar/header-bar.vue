<template>
  <div class="header-bar">
    <SliderTrigger :isCollapsed="collapsed" @slider-collape="handleCollpasedChange"></SliderTrigger>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import SliderTrigger from './slider-trigger'
export default {
  name: 'HeaderBar',
  components: {
    SliderTrigger
  },
  props: {
    collapsed: Boolean
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>

<style lang="less">
  .header-bar{
    width: 100%;
    height: 100%;
    position: relative;
  .custom-content-con{
    float: right;
    height: auto;
    padding-right: 20px;
    line-height: 64px;
  & > *{
      float: right;
    }
  }
  }
</style>
