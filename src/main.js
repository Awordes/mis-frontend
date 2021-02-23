import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLoader from './loader';
axios.defaults.withCredentials = true;

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


router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {      
    
    Vue.axios
    .get(Vue.prototype.$baseUrl + '/Auth/LoginCheck')
    .then((response) => {
      console.log(response.status);
      next()
    }, (error) => {
      console.log(error);
      next({name: 'auth'});
      return
    })  
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