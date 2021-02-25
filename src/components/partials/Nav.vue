<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/#/auth">MIS</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/#/client">Список ВСД</b-nav-item>
          <b-nav-item href="#" v-on:click="logout">Выход</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: "Nav",
  methods: {
    logout: function() { 
      Vue.axios
      .post(this.$baseUrl + '/Auth/Logout')
      .then(() => {
          this.$isAuthorized = false;
          this.$router.push("auth")
      },  (error) => {
          console.log(error);
      })
    }
  },
};
</script>