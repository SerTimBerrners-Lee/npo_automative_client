<template>
	<div class="scroll-table">
		<QuickFilter 
      v-if='attention'
      @attention='$emit("unmount_attention")'
      @date_first='$emit("sortToDate")'
      @my_object='$emit("sortToMyObject")'
      :hide_filter_responsibil='hide_filter_responsibil'
    />
		<table class="provider_table"> 
			<tr> 
				<th>ИНН</th>
				<th style="width: 440px;">Наименование покупателя
				</th>
			</tr>
			<tr>
				<td colspan='2'>
					<Search 
						:placeholder='`Поиск по ${allBuyer.length} наименованиям`'
						@unmount='keySearch' 
					/>
				</td> 
			</tr>
			<tr v-for="buyer in allBuyer" 
				:key="buyer" 
				class="td-row"
				@click="e => setBuyer(buyer, e.target.parentElement)">
				<td>{{ buyer.inn }}</td>
				<td>{{ buyer.name }}<span class='exclamation_item' v-if='buyer.attention'>!</span></td>
			</tr>
			<tr>
				<td>...</td><td>...</td>
			</tr>
		</table>
	</div>
</template>
<script>
import {mapMutations} from 'vuex';
import Search from '@/components/Search';
export default {
	props: ['allBuyer', 'attention', 'hide_filter_responsibil'],
	data() {
		return {
			span_buyer: null
		}
	},
	components: {Search},
	methods: {
		...mapMutations(['searchBuyerMutations']),
		setBuyer(buyer, e) {
			if(this.span_buyer) this.span_buyer.classList.remove('td-row-all')
			this.span_buyer = e
			this.span_buyer.classList.add('td-row-all')

			this.$emit('unmount', buyer)
		},
		keySearch(key) {
			this.searchBuyerMutations(key)
    }
	}
}
</script>