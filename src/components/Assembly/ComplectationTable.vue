<template>
	<div>
		<h3>Комплектация</h3>
		<table v-if='load' style='width: 100%;'>
			<tr>
				<th>Артикул</th>
				<th>Наименование</th>
				<th>Ед.</th>
				<th>Кол-во на 1 СБ</th>
				<th>Кол-во всего, шт</th>
				<th>Дефицит всего, шт.</th>
			</tr>
			<tr v-for='komp of komplect' :key='komp'>
				<td>{{ komp.art }}</td>
				<td>{{ komp.name }}</td>
				<td class='center'>
					<span v-if="komp.ez == 1"> шт</span> 
					<span v-if="komp.ez == 2"> л </span>
					<span v-if="komp.ez == 3"> кг</span> 
					<span v-if="komp.ez == 4"> м </span>
					<span v-if="komp.ez == 5"> м.куб</span>
				</td>
				<td class='center'>{{ komp.kol }}</td>
				<td class='center'>{{ komp.kol_all }}</td>
				<td class='center'>{{ komp.dificit }}</td>
			</tr>
		</table>
		<MiniLoader v-else />
	</div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
	props: ['izdel'],
	data() {
		return {
			load: false,
			komplect: []
		}
	},
	methods: {
		...mapActions(['getOneCbEdById', 'getOneDetal', 'fetchGetOnePPM'])
	},
	async mounted() {
		if(!this.$props.izdel) return false
		let izd = this.$props.izdel
		if(izd.listCbed) {
			try {
				const cb = JSON.parse(izd.listCbed)
				for(let iz of cb) {
					const cbed = await this.getOneCbEdById(iz.cb.id)
					if(!cbed) continue;
					this.komplect.push({
						type: 'СБ',
						art: iz.art,
						name: iz.cb.name,
						kol: iz.kol,
						ez: iz.ez,
						kol_all: cbed.cbed_kolvo,
						dificit: cbed.cbed_kolvo - cbed.shipments_kolvo
					})
				} 
			}	catch(e) {
				console.error(e)
			}
		}
		if(izd.listDetal) {
			try {
				const det = JSON.parse(izd.listDetal)
				for(let iz of det) {
					const detal = await this.getOneDetal(iz.det.id)
					if(!detal) continue;
					this.komplect.push({
						type: 'Д',
						art: iz.art,
						name: iz.det.name,
						kol: iz.kol,
						ez: iz.ez,
						kol_all: detal.detal_kolvo,
						dificit: detal.detal_kolvo - detal.shipments_kolvo
					})
				}
			} catch(e) {
				console.error(e)
			}
		}
		if(izd.listPokDet) {
			try {
				const pd = JSON.parse(izd.listPokDet)
				for(let iz of pd) {
					const mat = await this.fetchGetOnePPM(iz.mat.id)
					if(!mat) continue;
					this.komplect.push({
						type: 'ПД',
						art: iz.art,
						name: iz.mat.name,
						kol: iz.kol,
						ez: iz.ez,
						kol_all: mat.material_kolvo,
						dificit: mat.material_kolvo - mat.shipments_kolvo
					})
				}
			} catch(e) { console.error(e)}
		}
		if(izd.materialList) {
			try {
				const ml = JSON.parse(izd.materialList)
				for(let iz of ml) {
					const mat = await this.fetchGetOnePPM(iz.mat.id)
					if(!mat) continue;
					this.komplect.push({
						type: 'РМ',
						art: iz.art,
						name: iz.mat.name,
						kol: iz.kol,
						ez: iz.ez,
						kol_all: mat.material_kolvo,
						dificit: mat.material_kolvo - mat.shipments_kolvo
					})
				}
			} catch(e) { console.error(e)}
		}
		this.load = true
  }
}
</script>