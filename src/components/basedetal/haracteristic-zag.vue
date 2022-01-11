<template>
	<div>
		<div>
		<h3>Характеристики детали</h3>
		<table class="tables_bf">
			<tr>
				<th>Наименование</th> 
				<th>ЕИ</th>
				<th>Значение</th>
			</tr>
			<tr 
				class='tr_haracteristic td-row' 
				v-for='(har, inx) in obj.haracteriatic' 
				:key='har'
				@click='selectHaracteristicFunction(har, inx)'
				>
				<td>
					<input 
						type="text" 
						:value='har.name' 
						class='inputs-small'
						@change='e => changeHaracteristic(e.target.value, "name", inx)'>
				</td>
				<td class='center'>
					<input 
						type="text" 
						:value='har.ez'
						style="width: 50px;"
						class='inputs-small center small'
						@change='e => changeHaracteristic(e.target.value, "ez", inx)'>
				</td>
				<td class='center'>
					<input 
						type="text" 
						:value='har.znach'
						style="width: 50px; text-align:center;"
						class='inputs-small'
						@change='e => changeHaracteristic(e.target.value, "znach", inx)'>
				</td>
			</tr>
		</table>
		<div class="btn-control">
			<button class="btn-add btn-small" @click='addHaracteristic'>Добавить</button>
			<button class="btn-sma" @click='removeHaracteristic'>Удалить</button>
		</div>
	</div>
		<h3>Характеристики заготовки</h3>
		<table class="tables_bf">
			<tr>
				<th>Наименование</th>
				<th>ЕИ</th>
				<th>Значение</th>
			</tr>
			<tr>
				<td>Материал заготовки</td>
				<td class='center'>шт</td>
				<td class='td_link center' @click='getMaterialForDetal' v-text='mat_zag.name || mat_zag' ></td>
			</tr>
			<tr>
				<td>Материал заготовки(Заменитель)</td>
				<td class='center'>шт</td>
				<td class='td_link center' @click='getMaterialForDetal("zam")' v-text='mat_zag_zam.name || mat_zag_zam' ></td>
			</tr>
			<tr v-if="(obj.diametr !== '')">
				<td>Диаметр</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "diametr")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.diametr'>
				</td>
			</tr>
			<tr v-if='obj.lengt'>
				<td>Длина</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "lengt")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.lengt'>
				</td>
			</tr>
			<tr v-if='obj.height'>
				<td>Высота</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "height")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.height'>
				</td>
			</tr>
			<tr v-if='obj.thickness'>
				<td>Толщина</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "thickness")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.thickness'>
				</td>
			</tr>
			<tr v-if='obj.wallThickness'>
				<td>Толщина стенки</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "wallThickness")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.wallThickness'>
				</td>
			</tr>
			<tr v-if='obj.width'>
				<td>Ширина</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "width")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.width'>
				</td>
			</tr>
			<tr v-if='obj.areaCS'>
				<td>Площадь сечения</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "areaCS")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.areaCS'>
				</td>
			</tr>
			<tr>
				<td>Расчетная масса заготовки</td>
				<td class='center'>кг</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "massZag")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.massZag'>
				</td>
			</tr>
			<tr>
				<td>Отходы</td>
				<td class='center'>кг</td>
				<td class='center'>
					<input type="text"
						@change='e=>editHarZag(e.target.value, "trash")'
						style="width: 100px; text-align:center;"
						class='inputs-small center'
						v-model='obj.trash'>
				</td>
			</tr>
		</table>
		<ModalBaseMaterial 
			:key='modalMaterialKey'
			v-if='modalMaterialIsShow'
			@unmount_material='unmount_material'
			:instanMaterial='1'
			:getOneMaterial='true'
		/>
	</div>
</template>
<script>
import { random } from 'lodash';
import {calcParams, changeHaracteristic, parseVariableFold} from './js/';
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue';
export default {
	props: ['parametrs'],
	data() {
		return {
			modalMaterialKey:  random(1, 999),
			modalMaterialIsShow:  false,
			mat_zag: 'Задать',
			mat_zag_zam: 'Задать',

			obj: {
        DxL: 'x',
				diametr: '',
				lengt: '',
				height: '',
				thickness: '',
				wallThickness: '',
				width: '',
				areaCS: '',

        massZag: '',
        trash: '',
				haracteriatic: [
          { name: 'Масса детали', ez: 'кг', znach: 0}
        ],
				variables_znach: []
      },
			density: 0,
		}
	},
	components: {ModalBaseMaterial},
	methods: {
		unmount_material(mat) {
			if(!this.mat_zag) {
				this.mat_zag = mat.material || 'Задать'
				if(mat.material) {
					this.calcParametr(mat.material)
					this.parseVariableFolder(mat.material)
				}
			}
			if(!this.mat_zag_zam)
				this.mat_zag_zam = mat.material || 'Задать'
			return 0
    },
		getMaterialForDetal(t = '') {
      this.modalMaterialKey = random(10, 999)
      this.modalMaterialIsShow = true
      t == 'zam' ? this.mat_zag_zam = '' : this.mat_zag = ''
    },
		editHarZag(val, inx) {
			changeHaracteristic(val, inx, this)
			this.emits()
		},
		calcParametr(m) {
			calcParams(m, this)

			this.emits()
		},
		parseVariableFolder(m) {
			parseVariableFold(m, this)

			this.emits()
		},	
		addHaracteristic() {
      this.obj.haracteriatic.push({name: '', ez: '', znach: ''})
    },
    removeHaracteristic() {
      if(this.selectHaracteristic.inx == 0) return false
      if(this.selectHaracteristic) {
        this.obj.haracteriatic.splice(this.selectHaracteristic.inx, 1)
        this.selectHaracteristic = null
      }
    },
    selectHaracteristicFunction(har, inx) {
      this.selectHaracteristic = { har, inx}
    },
    changeHaracteristic(val, inst, inx) {
      if(inst == 'name')  
        this.obj.haracteriatic[inx].name = val
      if(inst == 'ez')  
        this.obj.haracteriatic[inx].ez = val
      if(inst == 'znach')  {
        this.obj.haracteriatic[inx].znach = val
        if(inx == 0) 
          this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag
      }

			this.emits()
    },
		emits() {
			this.obj['mat_zag'] = this.mat_zag
			this.obj['mat_zag_zam'] = this.mat_zag_zam
			this.$emit('unmount_har_zam', this.obj)
		}
	}, 
	mounted() {
		if(this.$props.parametrs && this.$props.parametrs.obj ) {
			this.obj.DxL = this.$props.parametrs.obj.DxL
			this.obj.diametr = this.$props.parametrs.obj.diametr
			this.obj.lengt = this.$props.parametrs.obj.lengt
			this.obj.height = this.$props.parametrs.obj.height
			this.obj.thickness = this.$props.parametrs.obj.thickness
			this.obj.wallThickness = this.$props.parametrs.obj.wallThickness
			this.obj.width = this.$props.parametrs.obj.width
			this.obj.areaCS = this.$props.parametrs.obj.areaCS


			this.obj.massZag = this.$props.parametrs.obj.massZag
			this.obj.trash = this.$props.parametrs.obj.trash
			this.obj.haracteriatic = this.$props.parametrs.obj.haracteriatic
			this.obj.variables_znach = this.$props.parametrs.obj.variables_znach

			if(this.$props.parametrs.mat_zag) this.mat_zag = this.$props.parametrs.mat_zag
			if(this.$props.parametrs.mat_zag_zam) this.mat_zag_zam = this.$props.parametrs.mat_zag_zam
		}
	}
}
</script>

<style scoped>
table{
	width: 100%;
}
.td_link {
  cursor: pointer;
  user-select: none;
  text-decoration: underline;
  color: rgb(17, 90, 124);
  font-size: 14px;
  text-align: center;
  font-weight: bold;
}
.td_link:hover {
  color: rgb(36, 140, 189);
}
</style>