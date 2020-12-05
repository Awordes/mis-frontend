<template>
  <div>
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm";
export default {
  name: "Auth",
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
body {
  background-color: transparent;
}
</style>