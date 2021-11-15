<template>
	<div class="scroll-table">
		<table class="provider_table"> 
			<tr> 
				<th>ИНН</th>
				<th style="width: 440px;">Наименование покупателя</th>
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
				<td>{{ buyer.name }}</td>
			</tr>
			<tr v-for="i in 10" :key="i">
				<td>...</td><td>...</td>
			</tr>
		</table>
	</div>
</template>

<script>
import Search from '@/components/search.vue';
import {mapMutations} from 'vuex';
export default {
	props: ['allBuyer'],
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