<template>
  <div>
     <VdsList />
  </div>
</template>

<script>
import VdsList from "../components/VdsList";

import Vue from 'vue'


export default {
  name: "Client",
  components: {
    VdsList,
  },
  beforeCreate: function() { 
      Vue.axios
      .get('/api/Auth/LoginCheck')
      .then((response) => {
        console.log(response.status);
      }, () => {
        this.$router.push("auth")
      })
  }
};
</script>

<style scoped>
body {
  background-color: transparent;
}
</style>