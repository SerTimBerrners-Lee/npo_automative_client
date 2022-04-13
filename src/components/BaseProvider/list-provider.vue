<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3> Добавить поставщика </h3>
        <h4>База поставщиков</h4>
        <TableProvider :allProvider='allProvider' @unmount='setProvider'/>
        
        <div class="btn-control out-btn-control">
          <button class="btn-status" @click="destroyModalF">Отменить</button>
          <button class="btn-status btn-black" @click="addProvider" >Добавить</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions} from 'vuex';
import TableProvider from './table-provider';

export default {
  props: {
    parametrs: {}
  },
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      provider: null,
    }
  },
  computed: mapGetters(['allProvider']),
  components: {TableProvider},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';
    },
    ...mapActions(['fetchGetProviders']),
    setProvider(prov) {
      this.provider = prov;
    },
    addProvider() {
      this.$emit('unmount', this.provider);
      this.destroyModalF();
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';
    
    this.fetchGetProviders();
  },
}
</script>

<style scoped>
.tr-select{
  background-color: #d3d3d3;
}
.inn_td {
  width: 30%;
}
  table {
    width: 100%;
  }
  p {
    display: flex;
    flex-direction: column;
  }
  p input {
    width: 90%;
  }
  p textarea {
    width: 90%;
  }
  .right-menu-p>input {
    width: 70%;
  }
  .main-fb-modal-block p {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
  .main-fb-modal-block {
    display: flex;
    flex-wrap: wrap;
    width: 64%;
    justify-content: space-between;
  }
  .main-fb-modal-block>p * {
    margin-left: 10px;
  }
  .fb-img-block {
    width: 36%;
    float: left;
    height: 190px;
  }
  .scroll-table {
    width: 98%;
    height: 78vh;
  }
  .out-btn-control {
    margin-top: 10px;
  }
  .span-type-files {
    width: 100%;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 70px;
    color: #606060;
    background: #a4a4a4;
  }
  .imgShow-modal {
    height: 100%;
    width: 100%;
  }
  .imgShow-modal-div {
    display: flex;
    justify-content: center;
    widows: 100%;
    height: 100%;
  }
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 40vw;
}
.left-block-modal {
  width: 60vw;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
  @keyframes width {
  from {
    width: 1vw;
  }
  to {
    width: 40vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 60vw;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 60vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 50vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>