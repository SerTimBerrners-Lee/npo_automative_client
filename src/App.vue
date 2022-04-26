<template>
  <div @click='alwas'>    
    <InformFolder  
      :title='getTitleInform'
      :message='getMessageInform'
      :type='getTypeInform'
      :key='getKeyInform' />
      
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
import '@/assets/style/style.css';
import MenuItem from '@/components/MenuLeft';
import HeadersNav from '@/components/HeaderNav';
import Authorization from '@/views/Authorization';
import NavigationPanel from '@/components/NavigationPanel';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      avtorization: this.getAuth,
      inaction: 1,

      id_inaction_interval: null,
    }
  },
  components: {
    MenuItem,
    HeadersNav,
    NavigationPanel,
    Authorization
  },
  computed: mapGetters([
    'getAuth',
    'getTitleInform',
    'getMessageInform',
    'getTypeInform',
    'getKeyInform'
  ]),
  methods: {
    ...mapActions([
      'getUserById', 
      'fetchInactionHors', 
    ]),
    ...mapMutations([
      'updateAuth', 
      'setRoleAssets', 
      'unAuth'
    ]),
    exit() {
      this.unAuth();
      this.$router.push('/');
    },
    alwas() {
      if(this.id_inaction_interval)
        clearInterval(this.id_inaction_interval);

      this.id_inaction_interval = setInterval(() => {
        this.exit()
      }, 60000 * this.inaction);
    }
  },
  async mounted() {
    // Токен обновляется после каждого обновления
    if(this.getAuth && this.getAuth.id) {
      const user = await this.getUserById(this.getAuth.id);
      if(user) {
        if(!user) {
          this.unAuth();
          this.$emit('exit');
          this.$router.push('/');
        }
        // Обновляем пользователя 
        this.updateAuth(user);
        // Обновляем роль
        if(user.role && user.role.assets) {
          this.setRoleAssets({...user.role, assets: JSON.parse(user.role.assets)});
        }
      }
    } 

    const inaction = await this.fetchInactionHors();
    if(inaction && inaction.inaction) 
      this.inaction = inaction.inaction;
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
  padding: 5px;
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
