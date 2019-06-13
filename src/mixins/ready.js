export default {
  inject: ['mapComponent'],
  mounted () {
    this.mapComponent.map ? this.ready() : this.mapComponent.$on('ready', this.ready);
  },
  methods: {
    ready () {
      this.map = this.mapComponent.map;
      this.view = this.mapComponent.view;
      this.themeLayers=this.mapComponent.themeLayers;//暴露给GetFeatureInfo组件用
      this.selectedVectorLayer=this.mapComponent.selectedVectorLayer;//暴露给ShowFeatureInfo组件用,显示要素信息只显示筛选出的要素信息
      this._load();
    }
  }
};
