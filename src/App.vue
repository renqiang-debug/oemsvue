<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    localStorage.removeItem("uID");
    localStorage.removeItem("username");
  }
}
</script>
<style>
@import "./assets/css/main.css";
</style>
