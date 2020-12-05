import Vue from 'vue'
import App from './App.vue'
import router from './router'
//const axios = require('axios');

Vue.config.productionTip = false

/*
const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}
*/

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')