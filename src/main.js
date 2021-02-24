import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLoader from './loader';
axios.defaults.withCredentials = true;

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueAxios, axios);

Vue.prototype.$baseUrl = process.env.VUE_APP_API_URL;
Vue.prototype.$loaderStart = VueLoader.loaderStart;
Vue.prototype.$loaderEnd = VueLoader.loaderEnd;

router.beforeResolve((to, from, next) => {
  if(to.path) {
    VueLoader.loaderStart()
  }
  next()
});


router.beforeEach(async (to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {

    VueLoader.loaderStart();
    
    var loginCheck = await (new Promise((resolve) => {
          Vue.axios
        .get(Vue.prototype.$baseUrl + '/Auth/LoginCheck')
        .then(() => {
          resolve(true);
        }, () => {
          resolve(false);
        })
      }));

    VueLoader.loaderEnd();
      
    if (loginCheck)
      next();
    else
      next({name: 'auth'});
  }   
  next()
});


router.afterEach(() => {
  setTimeout(function() {
    VueLoader.loaderEnd();
  }, 888);
});

new Vue({
  router,
  VueLoader,
  methods: {
    loaderStart: function() {
      VueLoader.loaderStart()
    }
  },
  render: h => h(App),
}).$mount('#app')