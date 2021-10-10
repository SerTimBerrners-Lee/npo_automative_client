<template>
  <div class="rout-nav">
    <span 
      class="home-link tooltip" 
      @dblclick="clearAllNav" 
      @click='$router.push("/")' 
      >
      <span class="tooltiptext">Кликните 2 раза чтобы очистить все вкладки</span>
        <unicon name="house-user" fill="black" icon-style="monochrome"/>
      </span>
    
    <div v-for='(nav, inx) in getNav' :key='nav' :class='inx == 0 ? "links link_gradient" : "links"'>
      <span class='span_name active-span' v-if='inx == 0' ref='firstSpan'
        @click='e => pushNavigate(e.target, nav.path)'>{{ nav.name }}</span>
      <span class='span_name' v-if='inx != 0'
        @click='e => pushNavigate(e.target, nav.path)'>{{ nav.name }}</span>
      <span class='delit'
        @click='delPuth(nav)'><unicon name="minus-square-full" fill="red" width='16' /></span>
    </div>
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='showInformPanel'
      :key='keyInformTip'
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { assetsFunction } from '@/js/assets.js';
import { showMessage } from '@/js/'
import InformFolder from '@/components/InformFolder.vue'
export default {
  data() {
    return {
      span: null,
      toClick: false,

      titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,
    }
  },
  computed:{
    ...mapGetters(['getNav', 'getRoleAssets']),
  },
  components: {InformFolder},
  methods: {
    ...mapMutations(['delitPathNavigate', 'pushPathNavigate', 'deleteAllNav']),
    pushNavigate(span, path){
      if(this.span) 
        this.span.classList.remove('active-span')
      
      if(this.span && this.span.parentElement)
        this.span.parentElement.classList.remove('link_gradient')
          
      this.span = span;
      this.$refs.firstSpan.parentElement.classList.remove('link_gradient')
      this.$refs.firstSpan.classList.remove('active-span')

      this.span.parentElement.classList.add('link_gradient')
      this.toClick = true
      this.$router.push(path)
    },
    clearAllNav() {
      this.deleteAllNav()
    },
    unactiveClass() {
      if(this.span) 
        this.span.classList.remove('active-span')

      if(this.span && this.span.parentElement)
        this.span.parentElement.classList.remove('link_gradient')

      if(this.$refs.firstSpan)
        this.$refs.firstSpan.parentElement.classList.add('link_gradient')
    },
    delPuth(nav) {
      if(this.getNav.length < 2) 
        this.$router.push('/')

      this.delitPathNavigate(nav.path)
      if(this.getNav.length > 0) 
        this.$router.push(this.getNav[0].path)
      else 
        this.$router.push('/')
        
    },
  },
  async mounted() {
    this.$router.beforeEach(async(to, from, next) => {
      if(this.getRoleAssets) {
        let assets = await assetsFunction(to.path, this.getRoleAssets.assets)
        if(!assets) {
          next(false)
          return showMessage('', 'Недостаточно Прав!', 'w', this)
        } else next()
      }  else next()

      if(!this.toClick) {
        this.pushPathNavigate(to)
        this.unactiveClass()    
      }
      this.toClick = false
    })

  }
}
</script>

<style>
.active-span {
  border-bottom: 2px solid #141414;
}
.rout-nav {
  border-bottom: 1px solid #d3d3d3;
  height: 35px;
  display: flex;
  align-items: center;
  float: left;
  margin-top: 10px;
  margin-left: 200px;
  position: fixed;
  width: 100%;
  background: #515151;
  z-index: 4;
}
.rout-nav>span:hover {
  cursor: pointer;
  box-shadow: 11px 3px 10px 1px #e3e3e3;
  border-radius: 30px;
}
.links {
  height: 100%;
  display: flex;
  padding-left: 8px;
  padding-right: 8px;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #d3d3d3;
  background-color: rgb(255, 255, 255);
  user-select: none;
  justify-content: space-between;
}
.links:hover {
  cursor: pointer;
  box-shadow: 11px 3px 10px 1px #e3e3e3;
}
.span_name {
  max-height: 18px;
  width: max-content;
}
.home-link .unicon {
  background-color: rgb(255, 255, 255);
}
.delit {
  font-size: small;
  font-weight: bold;
  margin-top: 3px;
  margin-left: 3px;
  color: #00000073;
}
</style>