<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Новая задача №  от {{ dataReturn() }}</h3>
			<h3>Примечание</h3>
			<textarea></textarea>
      <div class='iform_block'>
        <h3>Информация</h3>
        <p>
          <span>Дата использования: </span>
          <input type="text">
        </p>
        <p>
          <span>Норма времени на выполнение: </span>
          <input type="text">
          <span>ч.</span>
        </p>
        <p>
          <span>Источник: </span>
          <input type="text">
        </p>
        <p>
          <span>Исполнитель: </span>
          <input type="text">
          <button class="btn-small btn-add">Добавить</button>
        </p>
        <p>
          <span>Контролер: </span>
          <input type="text">
          <button class="btn-small btn-add">Добавить</button>
        </p>
        <p>
          <span>Время на контроль: </span>
          <input type="text">
          <span>дней(0-неопределено) </span>
        </p>
        <p>
          <span>Срочность: </span>
          <input type="text">
        </p>
        <p>
          <span>Статус: </span>
          <input type="text">
        </p>
      </div>
      <div>
        <h3>Скриншот</h3>
        <div></div>
      </div>
      <div class='prov_block'>
        <h3>Привязка</h3>
        <p>
          <span>Изделия, СБ, детали:</span>
          <span></span>
          <button class="btn-small btn-add">Добавить</button>
        </p>
        <p>
          <span>Файлы:</span>
          <span></span>
          <button class="btn-small btn-add">Добавить</button>
        </p>
        <p>
          <span>Общецеховые нужды: </span>
          <input type="text" style='width: 20px'>
        </p>
      </div>
    </div>

    <div class="btn-control out-btn-control">
      <button class="btn-status" 
        @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black">Дать задачу</button>
    </div>

  </div>
</div>
</template>

<script>
import { dataFormat } from '@/js/'

export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;'


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
    dataReturn() {
      return dataFormat()
    }

  }
}
</script>

<style scoped>
  textarea {
    height: 130px;
  }
 .iform_block *, .prov_block * {
   margin-left: 5px;
 }
 .iform_block input {
   width: 90px;
 }
</style>