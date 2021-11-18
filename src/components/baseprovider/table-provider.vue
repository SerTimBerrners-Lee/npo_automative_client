<template>
	<div class="scroll-table">
		<table class="provider_table"> 
			<tr> 
				<th>ИНН</th>
				<th style="width: 440px;">Наименование поставщика</th>
			</tr>
			<tr>
				<td colspan='2'>
					<Search 
						:placeholder='`Поиск по ${allProvider.length} наименованиям`'
						@unmount='keySearch' 
					/>
				</td>
			</tr>
			<tr 
				v-for="provider in allProvider" 
				:key="provider" 
				class="td-row"
				@click="e=> setProvider(provider, e.target.parentElement)">
				<td>{{ provider.inn }}</td>
				<td>{{ provider.name }}</td>
			</tr>
			<tr>
				<td>...</td><td>...</td>
			</tr> 
		</table>
	</div>
</template>

<script>
import Search from '@/components/search.vue';
import {mapMutations} from 'vuex';
export default {
	props: ['allProvider'],
	data() {
		return {
			span_provider: null
		}
	},
	components: {Search},
	methods: {
		...mapMutations(['searchProviderMutations']),
		setProvider(proviedr, e) {
			if(this.span_provider) this.span_provider.classList.remove('td-row-all')
			this.span_provider = e
			this.span_provider.classList.add('td-row-all')

			this.$emit('unmount', proviedr)
		},
		keySearch(key) {
			this.searchProviderMutations(key)
    }
	}
}
</script>