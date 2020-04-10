<template>
  <div v-if="spinShown">
    <Spin fix class="spin-class" >
      <Icon type="ios-loading" size="20" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
export default {
  name: "Loading",
  data() {
    return {};
  },
  props: {
    spinShown: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped>
.spin-class {
  background-color: rgba(119, 136, 153, 0.5);
  color: white;
  font-size: 18px;
}
</style>