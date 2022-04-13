<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>{{ type == 'create' ? 'Создать' : 'Редактировать' }} раздел</h3>
      <div class="block">
        <p class="p_modal_name">  
          <span>Наименование: </span>
          <input type="text" v-model.trim='name'>
        </p>
      </div>
      <div class="btn-control out-btn-control">
        <button class="btn-status btn-black" 
          v-if="type == 'create'"
          @click='create'
          >Создать</button>
        <button class="btn-status btn-black" 
          v-else
          @click='update'
          >Обновить</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: ['chapter', 'type'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      name: '',

    }
  },
  methods: {
    ...mapActions(['createChapter', 'updateChapter']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
      this.$emit('unmount') 
    },
    create() {
      if(this.name.length < 2)
        return 0
      this.createChapter(this.name)
      this.destroyModalF()
    },
    update() {
      if(this.name.length < 2 || !this.$props.chapter)
        return 0

      let data = {
        id: this.chapter.id,
        name: this.name
      }
      this.updateChapter(data)
      this.destroyModalF()
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    if(this.$props.type != 'create' && !this.$props.chapter)
      this.destroyModalF()
    if(this.$props.type != 'create' )
      this.name = this.$props.chapter.name
  },
}
</script>

<style scoped>
.out-btn-control {
  width: 96%;
}
</style>