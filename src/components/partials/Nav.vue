<template>
  <nav class="top-menu" role="navigation">
    <ul class="menu-main">
      <li class="left-item">
        <router-link to="/auth" class="navbar-item">Авторизация</router-link>
      </li>
      <li class="right-item">
        <router-link to="/" class="navbar-item">Главная</router-link>
      </li>
      <li class="right-item">
        <router-link to="/client" class="navbar-item">Список ВДС</router-link>
      </li>
      <li class="right-item">
        <router-link to="/admin" class="navbar-item"
          >Панель администратора</router-link
        >
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: "Nav",
};
</script>

<style scoped>
.top-menu {
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  margin: 0 auto;
}
.menu-main {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 80%;
  position: relative;
  margin: 0 auto;
}
.menu-main:after {
  content: "";
  display: table;
  clear: both;
}
.left-item {
  float: left;
}
.right-item {
  float: right;
}
.menu-main a {
  text-decoration: none;
  display: block;
  line-height: 80px;
  padding: 0 20px;
  font-size: 18px;
  letter-spacing: 2px;
  font-family: "Arimo", sans-serif;
  font-weight: bold;
  color: rgb(32, 32, 32);
  transition: 0.3s linear;
}
.menu-main a:hover {
  background: rgba(255, 255, 255, 0.3);
}
@media (max-width: 830px) {
  .menu-main {
    /* padding-top: 90px; */
    text-align: center;
  }
  .menu-main li {
    float: none;
    display: inline-block;
  }
  .menu-main a {
    line-height: normal;
    padding: 20px 15px;
    font-size: 16px;
  }
}
@media (max-width: 630px) {
  .menu-main li {
    display: block;
  }
}
</style>