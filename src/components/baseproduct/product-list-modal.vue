<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
        <h3>Принадлежность</h3>
				<div class="block">
					<h3>Изделие</h3>
					<table>
						<tr>
							<th>Артикул</th>
							<th>Наименование</th>
							<th>ЕИ</th>
							<th>Кол-во на изделие</th>
						</tr>
            <tr v-for='product of $props.parametrs.products' :key='product'>
              <td>{{ product.articl }}</td>
              <td>{{ product.name }}</td>
              <td>шт</td>
              <td>
                {{
                  parseIzd(product)
                }}
              </td>
            </tr>
					</table>
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
      hiddens: 'display: none;'
    }
  },
  methods: {
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
    },
    parseIzd(cb) {
      let izdelie;
      if(this.$props.parametrs.type == 'cb' && cb.listCbed) 
        izdelie = JSON.parse(cb.listCbed)
      else if(this.$props.parametrs.type == 'det' && cb.listDetal) 
        izdelie = JSON.parse(cb.listDetal)
      else return 0
      for(let izd of izdelie) {
        if(this.$props.parametrs.type == 'cb') {
          if(izd.cb.id == this.$props.parametrs.id) 
            return izd.kol
        }
         if(this.$props.parametrs.type == 'det') {
          if(izd.det.id == this.$props.parametrs.id) 
            return izd.kol
        }
      }
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
}
table{
  width: 100%;
}
</style>