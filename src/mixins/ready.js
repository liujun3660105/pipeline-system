export default {
  inject: ['mapComponent'],
  mounted () {
    this.mapComponent.map ? this.ready() : this.mapComponent.$on('ready', this.ready);
  },
  methods: {
    ready () {
      this.map = this.mapComponent.map;
      this.view = this.mapComponent.view;
      this._load();
    }
  }
};
