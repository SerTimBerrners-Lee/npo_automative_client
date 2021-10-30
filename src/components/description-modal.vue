<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
        <h3>Примечание</h3>
        <textarea maxlength='250' v-model='description'></textarea>
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
	
			description: ''
    }
  },
  methods: {
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
			this.$emit('unmount', this.description)
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

		if(this.$props.parametrs)
			this.description = this.$props.parametrs
  },
}
</script>

<style scoped>
textarea {
  height: 130px;
  width: 99%;
}
</style>