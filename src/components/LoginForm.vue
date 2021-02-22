<template>
  <div>
    <div class="login-wr">
      <div id="logo"></div>

      <div class="form login">
        <input
          required
          v-model="username"
          type="text"
          placeholder="Пользователь"
        />
        <input
          required
          v-model="password"
          type="password"
          placeholder="Пароль"
        />

        <button v-on:click="login" type="submit">Вход</button>
        
      </div>
    </div>
  </div>
</template>


<script>

import Vue from 'vue'

export default {
  name: "LoginForm",
  data() {
    return {
      username: this.username,
      password: this.password
    }
  },
  methods: {
    login: function () {
      this.$loaderStart()
      Vue.axios
      .post(this.$baseUrl + '/Auth/Login', {
        "login": this.username,
        "password" : this.password,
        "rememberMe" : true,
      })
      .then((response) => {
        console.log(response.status);
        this.$router.push("client");
      }, (error) => {
        alert(error);
        this.$loaderEnd();
      })
    }
  }
};
</script>

<style scoped>
.login-wr {
  position: relative;
  margin: 60px auto;
  background: rgba(255, 255, 255, 0.7);
  max-width: 270px;
  box-shadow: 3px 3px 10px #333;
  padding: 15px 15px 0 15px;
}

#logo {
  height: 208px;
  background: url("../assets/logo.png") no-repeat center top 30px;
  text-align: left;
  font-weight: 200;
  font-size: 1.6em;
  margin: 0 0 10px 0;
  padding: 0 0 10px 0;
  color: #474747;
}

.form {
  padding-top: 20px;
  text-align: center;
}

input[type="text"],
input[type="password"],
button {
  margin-bottom: 25px;
  height: 40px;
  outline: 0;
}

input[type="text"] {
  background: url("../assets/user.png") no-repeat left 10px center;
}
input[type="password"] {
  background: url("../assets/passwd.png") no-repeat left 10px center;
}

input[type="text"],
input[type="password"] {
  width: calc(80% - 50px);
  border: none;
  border-bottom: 1px solid #666;
  padding: 0 0 0 50px;
  font-size: 14px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-bottom: 1px solid rgb(0, 0, 0);
  color: rgb(0, 0, 0);
}

a {
  text-align: center;
  font-size: 12px;
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

p {
  padding-bottom: 10px;
}
</style>