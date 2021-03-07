import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
Vue.config.productionTip = false

import axios from 'axios';
import VueAxios from 'vue-axios';
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

import VueLoader from '@/tools/loader';
Vue.prototype.$loaderStart = VueLoader.loaderStart;
Vue.prototype.$loaderEnd = VueLoader.loaderEnd;

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import Notification from '@/tools/notification';
Vue.prototype.$createNotification = Notification.createNotification;

Vue.prototype.$baseUrl = process.env.VUE_APP_API_URL;

Vue.use(require('vue-moment'));

import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state () {
    return {
      userTitle: '',
      roles: []
    }
  }
});
Vue.use(store);

router.beforeResolve((to, from, next) => {
  if(to.path) {
    VueLoader.loaderStart()
  }
  next()
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    VueLoader.loaderStart();

    var haveAccess = false;
    
    var loginCheck = await (new Promise((resolve) => {
      Vue.axios.get(Vue.prototype.$baseUrl + '/User/Current')
      .then((response) => {
        store.state.roles = response.data.roles;
        store.state.userTitle = response.data.title;
        haveAccess = response.data.roles.some(x => to.meta.roles.includes(x));
        resolve(true);
      }, () => {
        resolve(false);
      })
    }));

    VueLoader.loaderEnd();
      
    if (loginCheck){
      if (haveAccess)
        next();
      else {
        Notification.createMainNotification('danger', 'Ошибка', 'Недостаточно прав');
        next(from);
      }
    }
    else {
      Notification.createMainNotification('danger', 'Ошибка', 'Необходима авторизация');

      next({name: 'auth'});
    }
  }   
  next()
});


router.afterEach(() => {
  setTimeout(function() {
    VueLoader.loaderEnd();
  }, 888);
});

new Vue({
  store: store,
  router,
  VueLoader,
  methods: {
    loaderStart: function() {
      VueLoader.loaderStart()
    }
  },
  render: h => h(App),
}).$mount('#app')