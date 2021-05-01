<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="nav-bar">
      <b-navbar-brand href="/#/">MIS</b-navbar-brand>
      <b-navbar-nav v-if="this.$store.state.isLogged">
        <b-nav-text><span class="nav-margin username" v-text="this.$store.state.userTitle"></span></b-nav-text>
        <b-nav-text>
          <span class="nav-margin">Дата окончания подписки: 
            <span class="username">{{this.$store.state.expirationDate | moment("DD.MM.YYYY")}}</span>
          </span>
        </b-nav-text>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" v-if="this.$store.state.isLogged">
        <b-nav-item href="/#/admin" v-if="this.$store.state.roles.includes('admin')">Администрирование</b-nav-item>
        <b-nav-item href="/#/vsd" v-if="this.$store.state.roles.includes('client')">Список ВСД</b-nav-item>
        <b-nav-item href="#" v-on:click="logout">Выход</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" v-if="!this.$store.state.isLogged">
        <b-nav-item v-b-modal.applicant-create>Оставить заявку на регистрацию</b-nav-item>
        <CreateApplicantForm/>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import Vue from 'vue'
import CreateApplicantForm from './CreateApplicantForm.vue'

export default {
  name: "Nav",
  components: {
    CreateApplicantForm
  },
  methods: {
    logout: function() { 
      Vue.axios.post(this.$baseUrl + '/Auth/Logout')
      .then(() => {
          this.$store.state.userTitle = '';
          this.$store.state.expirationDate = '';
          this.$store.state.isLogged = false;
          this.$router.push("auth");
      },  (error) => {
          console.log(error);
          this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
      })
    }
  },
};
</script>

<style scoped>
.nav-bar {
  background-color: #4364a1;  
  box-shadow: 0 0 10px #333;
}

.nav-margin {
  margin: 0 7px;
}

.username {
  color: white;  
}
</style>