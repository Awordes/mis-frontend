import {BToast} from 'bootstrap-vue'

function createNotification(variant, title, message) {  
    this.$bvToast.toast(message, {
      title: title,
      autoHideDelay: 5000,
      solid: true,
      variant: variant
    });
}

function createMainNotification(variant, title, message) {  
  (new BToast()).$bvToast.toast(message, {
    title: title,
    autoHideDelay: 5000,
    solid: true,
    variant: variant
  });
}

export default {createNotification, createMainNotification}