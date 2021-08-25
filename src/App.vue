<template>
  <Authorization msg="Registration_page" @remove="test" />
</template>

<script>
import Authorization from './components/Authorization.vue'

export default {
  name: 'App',
  components: {
    Authorization
  },
  methods: {
    test(e) {
      console.log(e)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #2f2e33;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
