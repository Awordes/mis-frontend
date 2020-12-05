<template>
  <body class="main">
    <div id="app">
      <Nav />
      <router-view />
    </div>
  </body>
</template>
<script>
import Nav from "./components/partials/Nav.vue";
export default {
  name: "app",
  components: {
    Nav,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
html {
  background-image: url(./assets/bg.jpg);
  background-repeat: no-repeat;
}
</style>
