<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <div>
        <h3 v-if='parametrs.mat == "TYPE"'>{{ titleapp }} типа материала (тип категория)</h3>
        <h3 v-else>{{ titleapp }} подтипа</h3>
        <p v-if='parametrs.mat == "PODTYPE"'>
          <span>Тип: </span>
          <span style='font-weight: bold;'> 
            {{ parametrs.material ?
              parametrs.material.name : '' }}</span>
          <span v-if='parametrs.type == "edit"'>
            {{ parametrs.data.materials ? 
              parametrs.data.materials[0].name : '' }}</span>
        </p>
        <div class="block">
          <p style='display: flex; align-items: center;'> 
            <span>Наименование: </span>
            <input type="text" v-model.trim='nameInputs'>
          </p>
        </div>
        <div class="btn-control out-btn-control">
          <button class="btn-status btn-black" @click='addMaterial' v-if='parametrs.type == "create"'>Добавить</button>
          <button class="btn-status btn-black" @click='updeteMaterial' v-if='parametrs.type == "edit"'>Обновить</button>
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
      nameInputs: ''
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(this.parametrs.type != 'create') {
      this.titleapp = 'Редактирование'
      this.nameInputs = this.parametrs.data.name
    } 
  },
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    addMaterial() {
      if(this.nameInputs.length < 2)
        return 0
      if(this.parametrs.type == 'create' && this.parametrs.mat == 'TYPE') {
        this.$emit('unmountAdd', {
          type: this.parametrs.mat, 
          name: this.nameInputs
        })
      }
      if(this.parametrs.type == 'create' && this.parametrs.mat == 'PODTYPE') {
        this.$emit('unmountAdd', {
          type: this.parametrs.mat,
          name: this.nameInputs
        })
      }

      this.destroyModalF()
    },
    updeteMaterial() {
      if(this.nameInputs.length < 2)
        return 0

      if(this.parametrs.type == 'edit' && this.parametrs.mat == 'TYPE') {
        this.$emit('unmountUpdate', {
          type: this.parametrs.mat, 
          name: this.nameInputs,
          id: this.parametrs.data.id
        })
      }
      if(this.parametrs.type == 'edit' && this.parametrs.mat == 'PODTYPE') {
        this.$emit('unmountUpdate', {
          type: this.parametrs.mat,
          name: this.nameInputs,
          id: this.parametrs.data.id
        })
      }
      this.destroyModalF()
    }
  }
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
</style>