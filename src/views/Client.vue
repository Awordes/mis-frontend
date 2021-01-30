<template>
  <div>
     <VdsList />
  </div>
</template>

<script>
import VdsList from "../components/VdsList";
export default {
  name: "Client",
  components: {
    VdsList,
  },
};
</script>

<style scoped>
body {
  background-color: transparent;
}
</style>