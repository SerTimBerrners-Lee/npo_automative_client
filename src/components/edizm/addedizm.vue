<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>{{ titleapp }} единицы измерения</h3>
        <select class="select-small" v-model='selecter' v-if='parametrs.type == "create"'>
          <option>Выберите тип ЕИ</option>
          <option v-for='typeE of parametrs.typeE' :key='typeE' :value='typeE.id'>{{ typeE.name }}</option>
        </select>
        <p class="right-menu-p">
          <span>Ктаркая запись: </span><input type="text" v-model.trim='inputs_short'>
        </p>
        <p class="right-menu-p">
          <span>Полная запись : </span><input type="text" v-model.trim='inputs'>
        </p>
        <div class="btn-control out-btn-control">
          <button class="btn-status btn-black" @click='addEditEdizm'>Сохранить</button>
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
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
      inputs: '',
      inputs_short: '',
      titleapp: 'Добавление',
      selecter: 'Выберите тип ЕИ'
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(this.parametrs.type != 'create') {
      this.titleapp = 'Редактирование'
      this.inputs_short = this.parametrs.obj.short_name
      this.inputs = this.parametrs.obj.name
    } 
  },
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
      this.$emit('unmount', 0)
    },
    addEditEdizm() {
      if(typeof this.selecter != 'number' && this.parametrs.type == 'create')
        return 0
      if(this.inputs.length > 1 && this.inputs_short.length != '') {
        if(this.parametrs.type == 'create') {
          this.$emit('unmount', {
            type: 'create',
            name: this.inputs,
            short_name: this.inputs_short,
            typeEdizmId: this.selecter
          })
        } else if (this.parametrs.type == 'edit'){
          this.$emit('unmount', {
            type: 'edit',
            id: this.parametrs.obj.id,
            name: this.inputs,
            short_name: this.inputs_short
          })
        }
        this.destroyModalF()
      } else {
        this.$emit('unmount', {
          type: 'error',
          message: 'Слишком короткое наименование'
        })
        return 0
      }
    }
  }
}
</script>

<style scoped>
  .right-menu-p>input {
    width: 70%;
  }
  .select-small{
    font-size: 14px;
    padding: 5px;
    font-weight: bolder;
  }
</style>