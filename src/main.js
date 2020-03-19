import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import VueSwal from 'vue-swal'
import APlayer from '@moefe/vue-aplayer';
import {Tabs, Tab} from 'vue-tabs-component';
import Multiselect from 'vue-multiselect';
import Loading from 'vue-loading-overlay';
import StarRating from 'vue-star-rating'
import VueLazyload from 'vue-lazyload'


import 'vue-loading-overlay/dist/vue-loading.css';
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'vue-material/dist/vue-material.min.css'

import './registerServiceWorker'

Vue.use(VueMaterial)
Vue.use(VueSwal)
Vue.use(APlayer, {
  defaultCover: 'https://github.com/u3u.png', // set the default cover
  productionTip: false, // disable console output
});

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 5
})

Vue.component('tabs', Tabs);
Vue.component('tab', Tab);
Vue.component('multiselect', Multiselect)
Vue.component('star-rating', StarRating);
Vue.component('loading', Loading);

Vue.config.productionTip = false

Vue.filter('durationMin', function(v) {
  var hrs = ~~(v / 3600), mins = ~~((v % 3600) / 60), secs = ~~v % 60;
  return (hrs > 0 ? "" + hrs + ":" + (mins < 10 ? "0" : "") : "") + "" + mins + ":" + (secs < 10 ? "0" : "") + secs;
});
Vue.filter('filesize', function(v) {
  var arBytes = [{u: 'TB',v: Math.pow(1024,4)},{u: 'GB',v: Math.pow(1024,3)},{u: 'MB',v: Math.pow(1024,2)},{u: 'KB',v: 1024},{u: 'B',v: 1}];
  return (Math.round((v / (arBytes.find((o)=>{return v>o.v;})||{v:1}).v)*100)/100) + ' ' + (arBytes.find((o)=>{return v>o.v;})||{u:''}).u;
});
Vue.filter('tags', function(v) {
  return v.split(',');
});
Vue.filter('commas', function(v) {
  var parts = v.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
