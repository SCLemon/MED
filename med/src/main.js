import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Element UI 組件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// Google Map
import * as VueGoogleMaps from 'vue2-google-maps'

import './registerServiceWorker'

import {googleMapKey} from './apiKey'
Vue.use(VueGoogleMaps, {
  load: {
    key: googleMapKey,
    libraries: 'places', 
  },
})
Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
  router,
  beforeCreate(){
    // 全局事件總線
    Vue.prototype.$bus = this;
  } 
}).$mount('#app')
console.warn = function() {};
// console.error = function() {};

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('./registerServiceWorker.js')
//       .then(registration => {
//         console.log('Service Worker registered:', registration);
//       })
//       .catch(error => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }