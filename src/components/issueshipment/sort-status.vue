<template>
  <div>
    <select 
      class='select-small' 
      v-model='selectEnumShipments'>
      <option 
        v-for='item of enumShipments' 
        :key='item' 
        :value='item'>{{ item }}</option>
    </select>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      enumShipments: [
				'Все',				
				'Заказано',
				'Удалено',
				'Выполняется',
				'Отгружено',
				'Просрочено'
			],
			selectEnumShipments: 'Все'
    }
  },
  watch: {
		selectEnumShipments: function(val) {
			this.filterShipmentsToStatus(val)
		}
	},
  methods: {
    ...mapMutations(['filterShipmentsToStatus'])
  }
}
</script>