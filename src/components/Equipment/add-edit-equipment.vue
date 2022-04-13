<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <div v-if="parametrs.equipment == 'TYPE'">
        <h3>{{ titleapp }} типа оборудования</h3>
        <div class="block">
          <p class="p_modal_name"> 
            <span>Наименование: </span>
            <input type="text" v-model.trim='inputs'>
          </p>
        </div>
        <div class="btn-control out-btn-control">
          <button class="btn-status btn-black" 
            v-if="parametrs.type == 'create'" 
            @click='create'
            >Сохранить</button>
          <button class="btn-status btn-black" 
            v-if="parametrs.type == 'edit'"
            @click='update'>Сохранить</button>
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
      </div>
      <p v-if='parametrs.parent'>
        <span style="font-weight: bold;">Тип: </span><span>{{ parametrs.parent.name }}</span>
      </p>
      <div v-if="parametrs.equipment == 'PODTYPE'">
        <h3>{{ titleapp }} подтипа оборудования</h3>
        <div class="block">
          <p style="align-items: center;"> 
            <span>Наименование: </span>
            <input type="text" v-model.trim='inputs'>
          </p>
        </div>
        <div class="btn-control out-btn-control">
          <button class="btn-status btn-black" 
            v-if="parametrs.type == 'create'" 
            @click='create'
            >Сохранить</button>
            <button class="btn-status btn-black" 
            v-if="parametrs.type == 'edit'"
            @click='update'>Сохранить</button>
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
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
      titleapp: 'Добавление',
      inputs: '',
    }
  },
  methods: { 
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
      this.$emit('unmount', 0) 
    },
    create() {
      if(this.inputs.length < 3)
        return 0
      this.$emit('unmount', {
        type: this.parametrs.equipment,
        action: 'create',
        name: this.inputs
      })
      this.destroyModalF()
    },
    update() {
      if(this.inputs.length < 3)
        return 0
      this.$emit('unmount', {
        type: this.parametrs.equipment,
        action: 'edit',
        name: this.inputs
      })
      this.destroyModalF()
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(this.parametrs.type != 'create') {
      this.titleapp = 'Редактирование'
    } 
    if(this.parametrs.type == 'edit') 
      this.inputs = this.parametrs.data.name
      
  },
}
</script>

<style scoped>
.right-menu-p>input {
  width: 70%;
}
.input_znach {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
}
.input_znach p {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  margin: 0;
  width: 100%;
}
.select-small{
  font-size: 14px;
  padding: 5px;
  font-weight: bolder;
}
.block p * {
  margin-left: 10px;
}
.block p {
  display: flex;
  justify-content: space-between;
}
.block p input {
  width: 76%;
}
.select-small {
  width : 100%;
  height: 100%;
  margin: 0;
  border: none;
}
.out-btn-control{
    margin-top: 10px;
}
.p-types{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.p-types span:first-child {
  font-weight: bold;
}
table {
  user-select: none;
}
.p_modal_name {
  display: flex;
  align-items: center;
}
</style>