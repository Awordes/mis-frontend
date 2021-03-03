<template>
  <div class="login-wr form">
    <div class="username">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
      </svg>
      <input required v-model="username" type="text" placeholder="Пользователь" />
    </div>

    <div class="passwd">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-vector-pen" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828L10.646.646zm-1.8 2.908l-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
        <path fill-rule="evenodd" d="M2.832 13.228L8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086.086-.026z"/>
      </svg>
      <input required v-model="password" type="password" placeholder="Пароль" v-on:keyup.enter="onEnter" />
    </div>

    <div class="rememberMe">
      <b-checkbox v-model="rememberMe">Запомнить</b-checkbox>
    </div>

    <b-button v-on:click="login" type="submit" variant="outline-primary">Вход</b-button>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: "LoginForm",
  data() {
    return {
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    }
  },
  methods: {
    login: function () {
      this.username ??= "";
      
      this.$loaderStart();
      Vue.axios.post(this.$baseUrl + '/Auth/Login', {
        "login": this.username,
        "password" : this.password,
        "rememberMe" : this.rememberMe,
      }).then(() => {
          this.$loaderEnd();
          this.$router.push("client");
        }, (error) => {
          this.$loaderEnd();
          console.log(error);
          this.$createNotification('danger', 'Ошибка на сервере', error.response.data.error);
      });
    },

    onEnter: function() {
      this.login();
    }
  }
};
</script>

<style scoped>
.login-wr {
  box-shadow: 3px 3px 10px #333;
  position: absolute;
  background-color: white;
  margin: 80px auto;
  left: 1px;
  right: 1px;
  text-align: center;
  max-width: 270px;
  padding: 15px;
}

.username,
.passwd {
  border-bottom: 1px solid #666;
  margin-bottom: 25px;
  width: 75%;
  margin: 30px auto;
}

input[type="text"],
input[type="password"],
button {
  height: 40px;
  outline: 0;
}

input[type="text"],
input[type="password"] {
  width: 70%;
  border: none;
  padding: 0 0 0 10px;
  font-size: 14px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  color: rgb(0, 0, 0);
}

button {
  width: 80%;
  background: none;
  border: none;
  border: 1px solid #666;
  color: rgb(0, 0, 0);
  font-size: 18px;
  font-weight: 200;
  cursor: pointer;
  transition: box-shadow 0.4s ease;
}

*::-webkit-input-placeholder {
  color: #666;
}

*:-moz-placeholder {
  color: #666;
}

*::-moz-placeholder {
  color: #666;
}

*:-ms-input-placeholder {
  color: #666;
}

.rememberMe {
  margin: 15px;
}
</style>