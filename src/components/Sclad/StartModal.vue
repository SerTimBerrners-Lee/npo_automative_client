<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Заказ материала, инструмента и деталей</h3>
      <div class='head_block'>
        <span>Тип: </span>
        <span style='font-weight: bold;'>Круг</span>
        <span>Подтип: </span>
        <span style='font-weight: bold;'>Круг</span>
        <span>Наименование: </span>
        <span style='font-weight: bold;'>Круг</span>
      </div>
      <div>
        <h3>Дефицит</h3>
        <table>
          <tr>
            <th>ЕИ</th>
            <th>Количество</th>
          </tr>
        </table>
      </div>
      <div>
       <h3>Выбор поставщика</h3>
        <div class="scroll-table" style='width: 100%; height: fit-content;'>
          <table>
          <tr>
            <th>ИНН</th>
            <th>Наименование поставщика</th>
          </tr>
        </table>
        </div>
        <div class="btn-control">
          <button class="btn-small btn-add">Выбрать</button>
        </div>
      </div>
      <div class='input_block'>
        <p>
          <span>Выбранный поставщик: </span>
          <input type="text">
        </p>
        <p>
          <span>Счет: </span>
          <input type="text">
        </p>
        <p>
          <span>Планируемая дата прихода: </span>
          <input type="text">
        </p>
        <p>
          <span>Кол-во(кг): </span>
          <input type="text">
        </p>
      </div>
      <div>
        <h3>Примечание</h3>
        <textarea maxlength='250'></textarea>
      </div>
      <div class="btn-control out-btn-control">
        <button 
        class="btn-status"
        @click='destroyModalF'>
          Отмена
        </button>
        <button class="btn-status btn-black"
        >
          Сохранить
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
.head_block {
  display: flex;
  justify-content: space-between;
  background: #c1c1c1;
  padding-left: 10px;
  padding-right: 10px;
  height: 40px;
  align-items: center;
  border-radius: 3px;
}
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