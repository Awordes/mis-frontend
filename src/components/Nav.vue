<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="nav-bar">
      <b-navbar-brand href="/#/auth">MIS</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-nav-text><span class="username" v-text="this.$store.state.userTitle"></span></b-nav-text>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/#/admin" v-if="this.$store.state.roles.includes('admin')">Администрирование</b-nav-item>

          <b-nav-item href="/#/vsd" v-if="this.$store.state.roles.includes('client')">Список ВСД</b-nav-item>
          
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
      Vue.axios.post(this.$baseUrl + '/Auth/Logout')
      .then(() => {
          this.$router.push("auth");
          this.$store.state.userTitle = '';
      },  (error) => {
          this.$store.state.userTitle = '';
          console.log(error);
          this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
      })
    }
  },
};
</script>

<style scoped>
.nav-bar {
  background-color: rgb(67, 100, 161);  
  box-shadow: 0 0 10px #333;
}

.username {
  color: white;
}
</style>