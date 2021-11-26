<template>
	<div>
		<table class="tables_bf" >
		<tr>
			<th>Артикул</th>
			<th>Наименование</th>
			<th>Ед.</th> 
			<th>Кол-вл</th>
		</tr>
		<tr>
			<th colspan="4">Сборочные Единицы (Тип СБ)</th>
		</tr>
		<tr 
			v-for='cb in listCbed' 
			class='td-row'
			:key='cb.cb' 
			@click='openCbed(cb.cb.id)'>
			<td>{{ cb.art }} </td>
			<td>{{ cb.cb.name }}</td>
			<td> 
				<span v-if="cb.ez == 1"> шт</span> 
				<span v-if="cb.ez == 2"> л </span>
				<span v-if="cb.ez == 3"> кг</span> 
				<span v-if="cb.ez == 4"> м </span>
				<span v-if="cb.ez == 5"> м.куб</span>
			</td>
			<td>{{ cb.kol }}</td>
		</tr>
		<tr>
			<th colspan="4">Детали (Тип Д)</th>
		</tr>
		<tr 
			v-for='detal in listDetal' 
			:key='detal.det' 
			@click='openDetal(detal.det.id)'
			class='td-row'>
			<td>{{ detal.art }} </td>
			<td>{{ detal.det.name }}</td>
			<td> 
				<span v-if="detal.ez == 1"> шт</span> 
				<span v-if="detal.ez == 2"> л </span>
				<span v-if="detal.ez == 3"> кг</span> 
				<span v-if="detal.ez == 4"> м </span>
				<span v-if="detal.ez == 5"> м.куб</span>
			</td>
			<td>{{ detal.kol }}</td>
		</tr>
		<tr>
			<th colspan="4">Стандартные или покупные детали (Тип ПД)</th>
		</tr>
		<tr v-for='material in listPokDet' :key='material.mat'>
			<td>{{ material.art }} </td>
			<td>{{ material.mat.name }}</td>
			<td> 
				<span v-if="material.ez == 1"> шт</span> 
				<span v-if="material.ez == 2"> л </span>
				<span v-if="material.ez == 3"> кг</span> 
				<span v-if="material.ez == 4"> м </span>
				<span v-if="material.ez == 5"> м.куб</span>
			</td>
			<td>{{ material.kol }}</td>
		</tr>
		<tr>
			<th colspan="4">Расходные материалы (Тип РМ)</th>
		</tr>
		<tr v-for='material in materialList' :key='material.mat'>
			<td>{{ material.art }} </td>
			<td>{{ material.mat.name }}</td>
			<td> 
				<span v-if="material.ez == 1"> шт</span> 
				<span v-if="material.ez == 2"> л </span>
				<span v-if="material.ez == 3"> кг</span> 
				<span v-if="material.ez == 4"> м </span>
				<span v-if="material.ez == 5"> м.куб</span>
			</td>
			<td>{{ material.kol }}</td>
		</tr>
	</table>
	<ComponentCbedModal
		:id='parametrs_cbed'
		:key='cbedModalKey'
		v-if='parametrs_cbed'
	/>
	<DetalModal
		:key='detalModalKey'
		v-if='parametrs_detal'
		:id='parametrs_detal'
	/>
	</div>
</template>
<script>
import {random} from 'lodash';
import ComponentCbedModal from '@/components/cbed/cbed-modal.vue';
import DetalModal from '@/components/basedetal/detal-modal.vue';
export default {
	props: ['listCbed', 'listDetal', 'listPokDet', 'materialList'],
	data() {
		return {
			parametrs_detal: null,
			detalModalKey: random(1, 999),
      cbedModalKey: random(1, 999),
      parametrs_cbed: null,
		}
	},
	components: {ComponentCbedModal, DetalModal},
	methods: {
		openCbed(id) {
			if(!id) return false
      this.cbedModalKey = random(1, 999)
			this.parametrs_cbed = id
		},
		openDetal(id) {
			if(!id) return false
			this.parametrs_detal = id,
      this.detalModalKey = random(1, 999)
		}
	},
}
</script>

<style scoped>
.tables_bf {
	width: 100%;
}
</style>