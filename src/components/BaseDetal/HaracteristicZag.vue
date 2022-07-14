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
			<tr v-if="obj.diametr != null && obj.diametr !== ''">
				<td>Диаметр (НД)</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e => editHarZag(e.target.value, "diametr")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.diametr' 
						:disabled='isEdit.outsideDiametr'>
				</td>
			</tr>
			<tr v-if='obj.lengt != null && obj.lengt !== ""'>
				<td>Длина (Д)</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e => editHarZag(e.target.value, "lengt")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.lengt'
						:disabled='isEdit.length'>
				</td>
			</tr>
			<tr v-if='obj.height != null && obj.height !== ""'>
				<td>Высота (В)</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e => editHarZag(e.target.value, "height")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.height'
						:disabled='isEdit.height'>
				</td>
			</tr>
			<tr v-if='obj.thickness != null && obj.thickness !== ""'>
				<td>Толщина (Т)</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e => editHarZag(e.target.value, "thickness")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.thickness'
						:disabled='isEdit.thickness'>
				</td>
			</tr>
			<tr v-if='obj.wallThickness != null && obj.wallThickness !== ""'>
				<td>Толщина стенки (ТС)</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e => editHarZag(e.target.value, "wallThickness")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.wallThickness'
						:disabled='isEdit.wallThickness'>
				</td>
			</tr>
			<tr v-if='obj.width != null && obj.width !== ""'>
				<td>Ширина (Ш)</td>
				<td class='center'>мм</td>
				<td class='center'>
					<input type="text"
						@change='e => editHarZag(e.target.value, "width")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.width'
						:disabled='isEdit.width'>
				</td>
			</tr>
			<tr v-if='obj.areaCS != null && obj.areaCS !== ""'>
				<td>Площадь сечения (ПС)</td>
				<td class='center'>м.кв</td>
				<td class='center'>
					<input type="text"
						@change='e => editHarZag(e.target.value, "areaCS")'
						style="width: 100px;"
						class='inputs-small center'
						v-model='obj.areaCS'
						:disabled='isEdit.areaCrossSectional'>
				</td>
			</tr>
			<tr>
				<td>Расчетная масса заготовки</td>
				<td class='center'>кг</td>
				<td class='center'>
					<input type="text"
						@change='e=> editHarZag(e.target.value, "massZag")'
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
						@change='e=> editHarZag(e.target.value, "trash")'
						style="width: 100px; text-align:center;"
						class='inputs-small center'
						v-model='obj.trash'>
				</td>
			</tr>
		</table>

		<button
			v-if='false'
			class='btn-status btn_add_har'>Добавить характеристику <strong>+</strong>
		</button>
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
import { mapActions } from 'vuex';
import ModalBaseMaterial from '@/components/MathZag/ModalBaseMaterial';
import { calcParams, changeHaracteristic, parseVariableFold } from '@/components/BaseDetal/js/';

export default {
	props: ['parametrs'],
	data() {
		return {
			modalMaterialKey:  random(1, 999),
			modalMaterialIsShow:  false,
			mat_zag: 'Задать',
			mat_zag_zam: 'Задать',
			material: null,

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
      },
			isEdit: {
				outsideDiametr: false,
				length: false,
				height: false,
				thickness: false,
				wallThickness: false,
				width: false,
				areaCrossSectional: false
			},
			density: 0,
		}
	},
	components: { ModalBaseMaterial, AddHar },
	methods: {
		...mapActions(['getOneTypeMaterial']),
		// ТОЛЬКО ПЕРЕМЕННЫЕ ЗНАЧЕНИЯ МОЖНО РЕДАКТИРОВАТЬ !!!
		updateVariablesEdit(bools) {
			try {
				if (!this.material) return false;

				for (const item in this.isEdit) {
					const haracter = JSON.parse(this.material[item]);
					if (!haracter || !haracter.znach) 
						this.isEdit[item] = bools;
					else if (haracter.znach == 'permanent')
						this.isEdit[item] = bools;
					else this.isEdit[item] = !bools;
				}
			} catch (err) {console.error(err)}

		},
		unmount_material(mat) {
			if (!this.mat_zag) {
				this.mat_zag = mat.material || 'Задать';
				if (mat.material) {
					this.material = mat.material;
					this.calcParametr(mat.material);
					this.parseVariableFolder(mat.material);
				} else this.nullable(true);
			}
			if (!this.mat_zag_zam) {
				this.mat_zag_zam = mat.material || 'Задать';
				this.emits();
				if (!mat.material) this.nullable(false, true);
			}

			this.updateVariablesEdit(false);
			return 0;
    },
		getMaterialForDetal(t = '') {
      this.modalMaterialKey = random(10, 999);
      this.modalMaterialIsShow = true;
      t == 'zam' ? this.mat_zag_zam = '' : this.mat_zag = ''
    },
		editHarZag(val, inx) {
			if (!val) val = 0;
			changeHaracteristic(val, inx, this);
			this.emits();
		},
		calcParametr(m) {
			calcParams(m, this);
			this.emits();
		},
		parseVariableFolder(m) {
			parseVariableFold(m, this);
			this.emits();
		},	
		addHaracteristic() {
      this.obj.haracteriatic.push({name: '', ez: '', znach: ''});
    },
    removeHaracteristic() {
      if (this.selectHaracteristic.inx == 0) return false;
      if (this.selectHaracteristic) {
        this.obj.haracteriatic.splice(this.selectHaracteristic.inx, 1);
        this.selectHaracteristic = null;
      }
    },
    selectHaracteristicFunction(har, inx) {
      this.selectHaracteristic = { har, inx };
    },
    changeHaracteristic(val, inst, inx) {
      if (inst == 'name')  
        this.obj.haracteriatic[inx].name = val;
      if (inst == 'ez')  
        this.obj.haracteriatic[inx].ez = val;
      if (inst == 'znach')  {
        this.obj.haracteriatic[inx].znach = val;
        if (inx == 0) 
          this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag;
      }

			this.emits();
    },
		emits() {
			this.obj['mat_zag'] = this.mat_zag;
			this.obj['mat_zag_zam'] = this.mat_zag_zam;
			this.$emit('unmount_har_zam', this.obj);
		},
		updateObj(data) {
			this.obj.DxL = data.DxL;
			this.obj.diametr = data.diametr;
			this.obj.lengt = data.lengt;
			this.obj.height = data.height;
			this.obj.thickness = data.thickness;
			this.obj.wallThickness = data.wallThickness;
			this.obj.width = data.width;
			this.obj.areaCS = data.areaCS;

			this.obj.massZag = data.massZag;
			this.obj.trash = data.trash;
		},
		nullable(maz = false, zam = false) {
			if (maz) {
				this.updateObj({
					DxL: '',
					diametr: '',
					lengt: '',
					height: '',
					thickness: '',
					wallThickness: '',
					width: '',
					areaCS: '',
					massZag: '',
					trash: '',
				});
				this.mat_zag = 'Задать';
			}

			if (zam) this.mat_zag_zam = 'Задать';
			this.emits();
		}
	}, 
	async mounted() {
		if (this.$props.parametrs && this.$props.parametrs.obj) {
			this.updateObj(this.$props.parametrs.obj);

			this.obj.haracteriatic = this.$props.parametrs.obj.haracteriatic;

			if (this.$props.parametrs.mat_zag) {
				this.mat_zag = this.$props.parametrs.mat_zag;
				if (this.mat_zag.materialsId) 
					this.material = await this.getOneTypeMaterial(this.mat_zag.materialsId);

				this.updateVariablesEdit(true);
			}
			if (this.$props.parametrs.mat_zag_zam) 
				this.mat_zag_zam = this.$props.parametrs.mat_zag_zam;
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
.btn_add_har {
	margin: 0px;
	margin-top: 10px;
	width: 100%;
}
</style>