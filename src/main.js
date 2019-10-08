// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import App from './App'
import store from './store'
// import  from "axios";
import axios from './api/axios'

Vue.prototype.$axios=axios;
Vue.use(iView);

Vue.config.productionTip = false
Vue.prototype.HOST='/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
