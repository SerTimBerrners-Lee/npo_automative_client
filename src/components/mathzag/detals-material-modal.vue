<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Материал</h3> 
        <div class='head_block'>
          <div>
            <p>Тип: </p>
            <p style='font-weight: bold;'>{{ material ? material.material.name : '' }}</p>
          </div>
          <div>
            <p>Подтип: </p>
            <p style='font-weight: bold;'>{{ material ? material.podMaterial.name : '' }}</p>
          </div>
          <div>
            <p>Наименование: </p>
            <p style='font-weight: bold;'>{{ material ? material.name : '' }}</p>
          </div>
        </div>
      <div>
        <h3>Примечание</h3>
        <textarea  maxlength='250' :value='material ? material.description : "" '></textarea>
      </div>
    </div>
  </div>
  <InformFolder  
    :title='titleMessage'
    :message = 'message'
    :type = 'type'
    v-if='message'
    :key='keyInformTip'
    />
</div>
</template>

<script>
import {random} from 'lodash';
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      message: '',
      type: '',
      keyInformTip: random(1, 999),

      komplect: [],
      material: null
    }
  },
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

    if(this.$props.parametrs) 
      this.material = this.$props.parametrs

  },
}
</script>

<style scoped>
.head_block {
  display: flex;
  justify-content: space-between;
  background: #c1c1c1;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: column;
}
.head_block div {
  display: flex;
}
.head_block div p {
  width: 50%;
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
  width: 90%;
}
</style>