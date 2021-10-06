<template>
  <div>
    <div id="nav" v-if="getAuth">
        <HeadersNav @exit='exit' />
        <MenuItem />
        <NavigationPanel />
      <div class="container">
        <router-view />
      </div>
    </div>
    <div v-if="!getAuth" >
      <Authorization  />
    </div>
  </div>
</template>

<script>

import MenuItem from '@/components/menu-left';
import HeadersNav from '@/components/header-nav';
import NavigationPanel from '@/components/navigation-panel';
import Authorization from '@/views/Authorization.vue';
import '@/assets/style/style.css'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    MenuItem,
    HeadersNav,
    NavigationPanel,
    Authorization
  },
  data() {
    return {
      avtorization: this.getAuth
    }
  },
  computed: mapGetters(['getAuth']),
  methods: {
    ...mapActions(['getUserById']),
    ...mapMutations(['updateAuth', 'setRoleAssets']),
    exit() {
      console.log(this.getAuth)
    }
  },
  async mounted() {
    // Токен обновляется после каждого обновления
    if(this.getAuth && this.getAuth.id) {
      let user = await this.getUserById(this.getAuth.id)
      if(user) {
        // Обновляем пользователя 
        this.updateAuth(user)
        // Обновляем роль
        if(user.role && user.role.assets) {
          this.setRoleAssets({...user.role, assets: JSON.parse(user.role.assets)})
        }
      }
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: subpixel-antialiased; 
    left: 0;
    top: 0;
  }
  body {
    margin: 0px;
  }
  h3 {
      font-weight: unset;
      font-size: 21px;
  }
  .type-operation {
      width: 210px;
      height: 70px;
      border: 1px solid #9b9b9b;
      border-radius: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;
      margin: 10px;
      user-select: none;
  }
  .type-operation>span:first-child{
      width: 10%;
      text-align: center;
  }
  .type-operation>span:last-child {
      width: 85%;
      text-align: center;
  }
  .type-operation:hover {
      cursor: pointer;
      background: #494949;
      border: none;
  }
  .operation-block {
      display: flex;
      flex-wrap: wrap;
  }
  table {
      border: 1px solid #d3d3d3;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 16px;
  }
  th {
      border: 1px solid #d3d3d3;
      padding: 6px !important;
  }
  td {
      border: 1px solid #d3d3d3;
      padding: 5px !important;
  }
  .result-work {
        margin: 10px;
        border: 1px solid #d3d3d3;
        border-radius: 5px;
        padding: 20px;
        display: flex;
        align-items: center;
    }
    .result-work * {
        margin-left: 10px;    
    }
    button {
        cursor: pointer;
        height: 25px;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #d3d3d3;
    }
    .calendar-input {
        width: 100px;
        height: 22px;
    }
    .input-periud {
        width: 40px;
        height: 22px;
    }
    a {
      text-decoration: none;
      color: #000 !important;
    }
    .btn-control> * {
      margin: 5px;
      padding-left: 5px;
      padding-right: 5px;
    }
    .btn-control {
      display: flex;
      justify-content: flex-end;
    }
    .btn-add {
      background:#00fb91;
    }
    .btn-small {
      border: none;
      border-radius: 4px;
      padding-bottom: 20px;
    }
    .btn-small:hover {
      opacity: 0.7;
    }
    .width-350 {
        width: 350px;
    }
    .scrolls-type-490{
        height: 490px !important;
    }
    .cont {
        float: left;
    }
    .block {
      border: 1px solid #d3d3d3;
      border-radius: 4px;
      padding: 8px;
    }
    input {
      border-radius: 5px;
      border: 1px solid #d3d3d3;
      padding: 5px;
      width: max-content;
    }
    
</style>
