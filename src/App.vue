<template>
  <Authorization msg="Registration_page"/>
</template>

<script>
import Authorization from './components/Authorization.vue'

export default {
  name: 'App',
  components: {
    Authorization
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
