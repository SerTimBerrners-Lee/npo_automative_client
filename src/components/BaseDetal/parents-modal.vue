<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
        <TableNode  
					v-if='izd' 
					:izd='izd'
					:css='"full"'
          :no_show_izd='no_show_izd'
          :no_show_cb='no_show_cb'
          :no_show_det='no_show_det'
				/>
      </div>
    </div>
  </div>
</template>

<script>
import TableNode from '@/components/MathZag/table-node';

export default {
  props: ['izd', 'no_show_izd', 'no_show_cb', 'no_show_det'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
    }
  },
	components: {TableNode},
  methods: {
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
  },
}
</script>

<style scoped>
textarea {
  height: 130px;
  width: 99%;
}
</style>