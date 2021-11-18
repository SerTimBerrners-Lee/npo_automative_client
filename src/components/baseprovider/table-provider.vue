<template>
	<div class="scroll-table">
		<table class="provider_table"> 
			<tr> 
				<th>ИНН</th>
				<th style="width: 440px;">Наименование поставщика
					<span 
            class='exclamation tooltip' v-if='attention' 
            @click='$emit("unmount_attention")'>
            <unicon name="exclamation" fill="red" />
            <span class='tooltiptext'>Соритировать по отметке</span>
          </span> 
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
import Search from '@/components/search.vue';
import {mapMutations} from 'vuex';
export default {
	props: ['allProvider', 'attention'],
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