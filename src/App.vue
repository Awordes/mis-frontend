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
}
html {
  background-color: rgb(148, 139, 81);
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  background-size: cover;  
  background-repeat: no-repeat;
}
</style>
