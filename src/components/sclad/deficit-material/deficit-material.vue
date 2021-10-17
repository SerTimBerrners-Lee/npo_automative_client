<template>
	<div>
		<h3>Дефицит материалов</h3>
		<div>
			<div class="block header_block">
				<span>Выбрать период, с:</span>
				<input type="text">
				<span>по: </span><input type="text">
				<button class="btn-small">Сбросить период или дату</button>
			</div>
		</div>

		<div>
			<div class="scroll-table table_material">
				<table style="width: 200px;">
					<tr>
						<th>Категория</th>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(0, e.target.parentElement)'>
						<td>Все</td>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(1, e.target.parentElement)'>
						<td>Материалы </td>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(2, e.target.parentElement)'>
						<td>Покупные детали</td>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(3, e.target.parentElement)'>
						<td>Расходные материалы</td>
					</tr>
				</table>
				<table style="width: 150px;">
					<tr>
						<th>Тип</th>
					</tr>
					<tr 
						class='td-row' 
						v-for='typ of alltypeM' 
						:key='typ'
						@click='clickMat(typ)'>
						<td>{{ typ.name }}</td>
					</tr>
				</table>
				<table style="width: 150px;">
					<tr>
						<th>Подтип</th>
					</tr>
					<tr 
						class='td-row' 
						v-for='p_type of allPodTypeM' 
						:key='p_type'
						@click='clickMat(p_type)'>
						<td>{{ p_type.name }}</td>
					</tr>
				</table>
				<table>
					<tr>
						<th>Наименование</th>
						<th>ЕИ</th>
						<th>Остаток на дату</th>
						<th>План расход на план</th>
						<th>План остаток</th>
						<th>Среднестат. расход</th>
						<th>Мин. остаток</th>
						<th>Рекомендованный остаток</th>
						<th>Дефицит</th>
						<th>Дефицит в рублях</th>
						<th>Рекомендованный заказ</th>
						<th>План приход (данные по счету)</th>
						<th>Дата прихода</th>
						<th>План остаток после план прихода</th>
						<th>План дефицит/Профицит</th>
						<th>Статус</th>
					</tr>
					<tr v-for='material of getOnePodMaterial' :key='material'>
						<td 
							@click='e => setMaterial(material, e.target)'
							class='td-row'> {{ material.name }}</td>
							<td v-html="getKolvoMaterial(material.kolvo)">
							</td>
					</tr>
				</table>
			</div>
			<div class='btn-control'>
				<button class="btn-small btn-add" 
					@click='start'> Запустить </button>
				<button class="btn-small"> Выгрузка в Excel </button>
				<button class="btn-small"> Печать отчета </button>
			</div>
		</div>
		<Start
			v-if='showStart'
			:key='startKey'
		/>
	</div>
</template>

<script> 
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {random} from 'lodash';
import Start from '../start-modal.vue'
export default {
	data() {
		return {
			showStart: false,
			startKey: random(1, 999),

			span: null,
			instansLet: 0,

			material: null,
			span_material: null,
		}
	},
	components: {Start},
	computed: mapGetters(['getOnePodMaterial', 'alltypeM', 'allPodTypeM']),
	methods: {
		...mapActions(['fetchGetAllDeficitPPM']),
		...mapMutations(['getInstansMaterial', 'filterByNameMaterial']),
		start() {
			this.showStart = true;
			this.startKey = random(1, 999);
		},
		instansMaterial(instans, span) {
      if(this.span) 
				this.span.classList.remove('td-row-all')
			if(this.instansLet == instans)
				return 0

      this.span = span
			this.span.classList.add('td-row-all')

      this.getInstansMaterial(instans)
      this.instansLet = instans

    },
		clickMat(mat) {
			this.filterByNameMaterial(mat) 
    },
		setMaterial(material, span) {
			if(this.material && this.material.id == material.id && this.span_material) {
				this.material = null;
				return this.span_material = null
			}
			if(this.span_material)
				this.span_material.classList.remove('td-row-all')
			this.span_material = span
			this.span_material.classList.add('td-row-all')

			this.material = material
		},
		getKolvoMaterial(kol) {
			try {
				let pars_json = JSON.parse(kol)
				let str = ''
				if(pars_json.c1) str = '<span> шт </span>'
				if(pars_json.c2) str = str + '<span> л </span>'
				if(pars_json.c3) str = str + '<span> кг </span>'
				if(pars_json.c4) str = str + '<span> м </span>'
				if(pars_json.c5) str = str + '<span> м.куб </span>'
				return str
			} catch (e) {
				console.log(e)
			}
		}
	},
	async mounted() {
		this.fetchGetAllDeficitPPM()
	}
}
</script>

<style scoped>
.table_material {
	display: flex;
}
table {
	height: fit-content;
}
</style>