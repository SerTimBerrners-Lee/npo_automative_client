<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <div v-if="parametrs.instrument == 'TYPE'">
        <h3>{{ titleapp }} типа инструмента или оснастки</h3>
        <div class="block">
            <p class="p_modal_name">  
                <span>Наименование: </span>
                <input type="text" v-model.trim='inputs'>
            </p>
            <div class='block_radio'>
              <p class='p_radio'>
                <label for="r1"> Инструмент</label>
                <input id='r1' type="radio" value="1" v-model="instans">
              </p>
              <p class='p_radio'>
                <label for="r2"> Оснастка</label>
                <input id='r2' type="radio"  value="2" v-model="instans">
              </p>
              <p class='p_radio'>
                <label for="r3"> Мерительный инструмент</label>
                <input id='r3' type="radio"  value="3" v-model="instans">
              </p>
            </div>
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
      <div v-if="parametrs.instrument == 'PODTYPE'">
        <h3>{{ titleapp }} подтипа инструмента или оснастки</h3>
        <div class="block">
            <p class='p_modal_name'> 
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
      instans: 1
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(this.parametrs.type != 'create') {
        this.titleapp = 'Редактирование'
    } 
    if(this.parametrs.type == 'edit')  {
      this.inputs = this.parametrs.data.name
      this.instans = this.parametrs.data.instans
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
        type: this.parametrs.instrument,
        action: 'create',
        name: this.inputs,
        instans: this.instans
      })
      this.destroyModalF()
    },
    update() {
      if(this.inputs.length < 3)
        return 0
      this.$emit('unmount', {
        type: this.parametrs.instrument,
        action: 'edit',
        name: this.inputs,
        instans: this.instans
      })
      this.destroyModalF()
    }
  }
}
</script>

<style scoped>
.out-btn-control {
  width: 96%;
}
.block_radio {
  height: 50px;
}
.right-menu-p>input {
  width: 50%;
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
.p_radio label {
  color: black;
  font-size: 15px;
}
.p_radio {
  width: fit-content;
  float: left;
}
.block p * {
  margin-left: 10px;
}

.block .p_modal_name {
  display: flex;
  justify-content: space-between;
}
.block p input[type='radio'] {
  width: fit-content;
    
}
.block p input[type='text'] {
  width: 100%;
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