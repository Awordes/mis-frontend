import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

import axios from 'axios';
import VueAxios from 'vue-axios';
axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);

Vue.prototype.$baseUrl = process.env.VUE_APP_API_URL;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')