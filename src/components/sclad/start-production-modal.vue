<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Запустить в производство</h3>
      <div class="block">
        <p>
          <span>Дата заказа: </span>
          <input type="text">
        </p>
        <p>
          <span>№ Заказа: </span>
          <input type="text">
        </p>
        <p>
          <span>Дата выполнения: </span>
          <input type="text">
        </p>
      </div>
      <div>
        <h3>Примечание</h3>
        <textarea></textarea>
      </div>
      <div>
        <h3>Комплектация</h3>
        <table>
          <tr>
            <th>Тип</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во</th>
          </tr>
        </table>
      </div>
      <div class="btn-control out-btn-control">
        <button 
        class="btn-status"
        @click='destroyModalF'>
          Отмена
        </button>
        <button class="btn-status btn-black"
          @click='start'>
            В производство
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 
  },
  methods: {
    destroyModalF() {
        this.destroyModalLeft = 'left-block-modal-hidden'
        this.destroyModalRight = 'content-modal-right-menu-hidden'
        this.hiddens = 'display: none;'
    },
    start() {
      this.destroyModalF()      
    }
  }
}
</script>

<style scoped>
  .out-btn-control {
    width: 96%;
  }
  table{ 
    width: 100%;
    margin-bottom: 50px;
  }
  .block input {
    width: 50px;
  }
  .block * {
    margin: 3px;
  }
  .block {
    display: flex;
  }
  .block p {
    display: flex;
    align-items: center;
    font-size: 13px;
  }
  textarea {
    height: 130px;
  }
 
</style>