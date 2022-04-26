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
				<th style="width: 440px;">Наименование поставщика
				</th>
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
				<td>{{ provider.name }}<span class='exclamation_item' v-if='provider.attention'>!</span></td>
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
	props: ['allProvider', 'attention', 'hide_filter_responsibil'],
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