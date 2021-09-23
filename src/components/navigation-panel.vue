<template>
    <div class="rout-nav">
        <span class="home-link">
            <router-link to="/">
                <unicon name="house-user" fill="black" icon-style="monochrome"/>
            </router-link>
        </span>

        <div class='links' v-for='(nav, inx) in getNav' :key='nav'>
            <span class='span_name active-span' v-if='inx == 0' ref='firstSpan'
                @click='e => pushNavigate(e.target, nav.path)'>{{ nav.name }}</span>
            <span class='span_name' v-if='inx != 0'
                @click='e => pushNavigate(e.target, nav.path)'>{{ nav.name }}</span>
            <span class='delit'
                @click='delPuth(nav)'>X</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    data() {
        return {
            span: null,
            toClick: false
        }
    },
    computed:{
        ...mapGetters(['getNav']),
    },
    methods: {
        ...mapMutations(['delitPathNavigate', 'pushPathNavigate']),
        pushNavigate(span, path){
            if(this.span)
                this.span.classList.remove('active-span')
            this.span = span;
            this.$refs.firstSpan.classList.remove('active-span')
            this.span.classList.add('active-span')
            this.toClick = true
            this.$router.push(path)
        },
        unactiveClass() {
            if(this.span)
                this.span.classList.remove('active-span')

            if(this.$refs.firstSpan)
                this.$refs.firstSpan.classList.add('active-span')
        },
        delPuth(nav) {
            if(this.getNav.length < 2) 
                this.$router.push('/')

            this.delitPathNavigate(nav.path)
        },
    },
    async mounted() {
        this.$router.beforeEach(async(to) => {
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
    border-bottom: 2px solid #1cd413;
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
    border-right: 1px solid #d3d3d3;
    background-color: rgba(255, 255, 255, 0.808);
    user-select: none;
    justify-content: space-between;
}
.links:hover {
    cursor: pointer;
    box-shadow: 11px 3px 10px 1px #e3e3e3;
}
.span_name {
    padding-top: 15px;
    height: 100%;
    padding-right: 8px;
}
.delit {
    font-size: small;
    font-weight: bold;
    padding: 4px;
    color: #00000073;
}
.delit:hover {
    background: #e6e6e6c5;
    border-bottom: 1px solid rgb(202, 41, 41);
}
</style>