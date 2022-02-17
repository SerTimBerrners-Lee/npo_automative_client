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
		<tr v-for='material in listPokDet' 
			class='td-row'
			@click='openMaterial(material.mat.id)'
			:key='material.mat'>
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
		<tr v-for='material in materialList' 
			class='td-row'
			@click='openMaterial(material.mat.id)'
			:key='material.mat'>
			<td>{{ material.art }} </td>
			<td>{{ material.mat.name }}</td>
			<td> 
				<span v-if="material.ez == 1"> шт</span> 
				<span v-if="material.ez == 2"> л </span>
				<span v-if="material.ez == 3"> кг</span> 
				<span v-if="material.ez == 4"> м </span>
				<span v-if="material.ez == 5"> м.куб</span>
			</td>
			<td class='center'>{{ material.kol }}</td>
		</tr>
	</table>
	<ModalCbed
		:id='parametrs_cbed'
		:key='cbedModalKey'
		v-if='parametrs_cbed'
	/>
	<DetalModal
		:key='detalModalKey'
		v-if='parametrs_detal'
		:id='parametrs_detal'
	/>
	<MaterialInformation 
		:key='material_key'
		v-if='material_id'
		:id='material_id'
	/>
	<ComplectModal 
    v-if='show_complect_modal && izd'
    :key='key_complect_modal'
    :parametrs='{type: type_izd, obj: izd}'
  />
	<button 
		style='width: 98%;'
		v-if='izd' 
		@click='openComplectModal'
		class="btn">Полная спетификация</button>
	</div>
</template>
<script>
import {random} from 'lodash';
import ComplectModal from '@/components/baseproduct/complect-modal.vue';
import MaterialInformation from '@/components/mathzag/material-information.vue';
export default {
	props: ['listCbed', 'listDetal', 'listPokDet', 'materialList', 'izd', 'type_izd'],
	data() {
		return {
			parametrs_detal: null,
			detalModalKey: random(1, 999),
      cbedModalKey: random(1, 999),
      parametrs_cbed: null,
			material_key: random(1, 999),
			material_id: null,

			show_complect_modal: false,
      key_complect_modal: random(1, 999)
		}
	},
	beforeCreate() {
    this.$options.components.DetalModal = require('@/components/basedetal/detal-modal.vue').default
    this.$options.components.ModalCbed = require('@/components/cbed/cbed-modal.vue').default
  },
	components: {MaterialInformation, ComplectModal},
	methods: {
		openComplectModal() {
      this.show_complect_modal = true
      this.key_complect_modal = random(1, 999)
    },
		openCbed(id) {
			if(!id) return false
      this.cbedModalKey = random(1, 999)
			this.parametrs_cbed = id
		}, 
		openDetal(id) {
			if(!id) return false
			this.parametrs_detal = id,
      this.detalModalKey = random(1, 999)
		},
		openMaterial(id) {
			this.material_key = random(1, 999)
			this.material_id = id
		}
	},
}
</script>

<style scoped>
.tables_bf {
	width: 100%;
}
</style>