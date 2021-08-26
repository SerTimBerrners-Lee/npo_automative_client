<template>
  <div id="nav">
    <!-- логика заключается в том что если человек не авторизован 
    кидаем его на страницу акторизации а так всегда открывается главная
    начальная страница -->
    <router-view />
  </div>
</template>

<script>
// import Authorization from './components/Authorization.vue'
// <Authorization msg="Registration_page" @remove="test" />
// import MenuIcon from 'vue-material-design-icons/Menu.vue';

export default {
  name: 'App',
  components: {
    // Authorization
    // "menu-icon": MenuIcon
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
  left: 0;
  top: 0;
}
body {
  margin: 0px;
}
</style>
