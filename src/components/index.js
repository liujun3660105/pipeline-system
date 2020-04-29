//注册全局组件
import Vue from 'vue';
import Loading from "./Loading";
import SvgIcon from '@/components/SvgIcon';

//自动加载svg文件
const req = require.context('../icons/svg',false,/\.svg$/);//返回加载函数
req.keys().map(req);

Vue.component('svg-icon',SvgIcon);
Vue.component("Loading",Loading);