<template>
	<div>
		<h3>Создать заказ</h3>
		<div class="block">
			<p class='p_flex'>
				<span>Дата заказа:</span>
				<DatePicterCustom 
					@unmount='changeDatePicter' 
					:dateStart='date_order'
					/>
				<span>Выбрать изделие: </span>
				<span 
					v-if='select_product' 
					class='select_span_href'>{{ select_product.name }}</span>
				<button class="btn-small btn-add" @click='selectProduct'>Выбрать</button>
				<span>Количество:</span>
				<input type="number" min='1' v-model='kol'>
			</p>
			<p class='p_flex'>
				<span>Рабочих дней до отгрузки:</span>
				<input type="number" min='0' v-model='day_when_shipments'>
				<span>Дата отгрузки:</span>
				<DatePicterCustom 
					@unmount='changeDatePicterShipments' 
					:dateStart='date_shipments'
				/>
				<label for='bran'>Бронь:</label>
				<input id='bran' type="checkbox" v-model='bron'>
				<span>Основание:</span>
				<input type="text" v-model='base'>
				<span>Покупатель:</span>
				<select class="select-small" v-model='buyer'>
					<option v-for='buyer in allBuyer' 
						:key='buyer'
						:value="buyer.id">{{ buyer.name }}</option>
				</select>
				<span>
					<label for='to_sklad'>На склад:</label>
					<input id='to_sklad' type="checkbox" v-model='to_sklad'>
				</span>
			</p>
		</div>
		<div class='table_block'>
			<div>
				<h3>Комплектация изделия</h3>
				<table>
					<tr>
						<th>№</th>
						<th>Наименование СБ или детали</th>
						<th>Кол-во</th>
					</tr>
					<tr 
						v-for='(obj, inx) of list_cbed_detal' 
						:key='obj'
						class='td-row' @click='e => selectTr(inx, e.target.parentElement)'>
						<td>{{ inx + 1 }}</td>
						<td>{{ obj.obj.name }}</td>
						<td class='center'>
							<input 
								type="text" 
								:value='obj.kol'
								class='input_kol center' 
								@change="e => editKolVo(inx, e.target.value)">
						</td>
					</tr>
				</table>
				<div class="btn-control">
					<button class="btn-small" @click='deleteCbEdDetal'>Удалить</button>
					<button class="btn-small" @click='addCbEdDetal'>Добавить СБ/деталь</button>
				</div>
			</div>
			<div>
				<h3>Примечание</h3>
				<textarea maxlength='250' v-model='description'></textarea>
			</div>
		</div>
		<div class="btn-control out-btn-control">
			<button 
				class="btn-status" 
				style="height: 0px;"
				@click="$router.push('/issueshipment')">
				Отменить 
			</button>
				<button 
				class="btn-status" 
				style="height: 0px;"
				@click="$router.push('/issueshipment')">
				Добавить новое изделие к заказу
			</button>
			<button 
				class="btn-status btn-black" 
				style="height: 0px;"
				@click='save_order'>
				Сохранить Заказ
			</button>
		</div>
	<ProductList 
		v-if='showProduct'
		:key='keyProductModal'
		@unmount='unmount_product'
	/>
	<BaseProductModal
		v-if='showModalDetalCb'
		:key='keyModalDetalCb'
		:enum='"two"'
		@responsDetal='responseDetalCb'
  />
	<InformFolder  
		:title='titleMessage'
		:message = 'message'
		:type = 'type'
		v-if='message'
		:key='keyInformTip'
    />
	</div>
</template>

<script>
import DatePicterCustom from '@/components/date-picter.vue';
import ProductList from '@/components/baseproduct/all-product-modal.vue';
import BaseProductModal from '@/components/baseproduct/base-product-all-modal.vue';
import {showMessage} from '@/js/';
import {mapActions, mapGetters} from 'vuex';
import {random} from 'lodash';
export default {
	data() {
		return{
			showProduct: false,
			keyProductModal: random(1, 999),

			showModalDetalCb: false,
      keyModalDetalCb: random(1, 999),

			titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,

			select_tr_inx: null,
			tr: null,
			
			date_order: new Date().toLocaleDateString("ru-RU"),
			date_shipments: new Date().toLocaleDateString("ru-RU"),
			kol: 1,
			day_when_shipments: 0,
			bron: false,
			base: '',
			buyer: 1,
			to_sklad: false,
			select_product: null,
			description: '',
			list_cbed_detal: [],
		}
	},
	watch: {
		kol: function(znach) {
			if(!this.select_product) return 0 
			this.list_cbed_detal = []
			for(let inx = 0; inx < znach; inx++) {
				this.checkedJsonList(this.select_product)
			}
		},	
	},
	computed: mapGetters(['allBuyer']),
	components: {DatePicterCustom, ProductList, BaseProductModal},
	methods: {
		...mapActions(['fetchCreateShipments', 'fetchAllBuyers', 'getOneCbEdById', 'getOneDetal']),
		addCbEdDetal() {
			this.showModalDetalCb = true;
			this.keyModalDetalCb = random(1, 999)
		},
		changeDatePicter(date) {
			this.date_order = date
		},
		changeDatePicterShipments(date) {
			this.date_shipments = date
		},
		selectProduct() {
			this.showProduct = true,
			this.keyProductModal = random(1, 999)
		},
		unmount_product(product) {
			if(!product) return 0
			this.list_cbed_detal = []
			
			this.select_product = product
			this.checkedJsonList(product)
		},
		checkedJsonList(izd) {
			if(izd.cbeds && izd.cbeds.length && izd.listCbed) {
				let list_cbed = JSON.parse(izd.listCbed)
				this.pushElement(izd.cbeds, list_cbed, 'cbed')
				for(let cb of list_cbed ) {
					this.getOneCbEdById(cb.cb.id).then(res => {
						let cbeds =  res.listCbed ? JSON.parse(res.listCbed) : []
						if(cbeds.length) {
							for(let inx in cbeds) {
								cbeds[inx] = cbeds[inx].cb
							}
						}
						for(let i = 0; i < cb.kol; i++) {
							this.checkedJsonList({...res, cbeds})
						}
					}) 
				}
			}

			if(izd.detals && izd.detals.length && izd.listDetal) {
				let list_detals = JSON.parse(izd.listDetal)
				this.pushElement(izd.detals, list_detals, 'detal')
				for(let det of list_detals ) {
					this.getOneDetal(det.det.id).then(res => {
						for(let i = 0; i < det.kol; i++) {
							let mat_true = false
							let material_find
							for(let material of res.materials) {
								if(material.id == res.mat_zag) {
									mat_true = true
									material_find = material
								}
							}
							if(mat_true) {
								let parse_str
								if(res.materialList) {
									parse_str = JSON.parse(res.materialList)
									parse_str.push({art: 1, mat: {id: material_find.id, name: material_find.name }, kol: 1})
									parse_str = JSON.stringify(parse_str)
								} else
										parse_str = JSON.stringify([{art: 1, mat: {id: material_find.id, name: material_find.name }, kol: 1}])
								this.checkedJsonList({...res, materialList: parse_str})
								mat_true = false
							}
							else this.checkedJsonList(res)
						}
					}) 
				}
			}
		},
		pushElement(elements, list_pars, type) {
			for(let element of elements) {
				let kol = 1;
				// let material = false;
				for(let item of list_pars) {
					let id;
					switch(type) {
						case 'cbed':
							id = item.cb.id;
							break;
						case 'detal':
							id = item.det.id
							break;
					}
					if(id == element.id)
						kol = item.kol
				}
				if(type != 'mat')  {
					let check = true
					for(let iz = 0; iz < this.list_cbed_detal.length; iz++) {
						if(element.id == this.list_cbed_detal[iz].obj.id && element.name == this.list_cbed_detal[iz].obj.name) {
							this.list_cbed_detal[iz].kol = Number(this.list_cbed_detal[iz].kol) + Number(kol)
							check = false
						}	
					}
					if(check) {
						this.list_cbed_detal.push({
							type,
							obj: {id: element.id, name: element.name},
							kol
						})
					} else check = true
				}
						
			}
		},
		responseDetalCb(res) {
			this.list_cbed_detal.push({
				...res, 
				obj: {id: res.obj.id, name: res.obj.name},
				kol: 1
			})
		},
		editKolVo(inx, val) {
			this.list_cbed_detal[inx].kol = val
		},
		deleteCbEdDetal() {
			if(this.select_tr_inx == null) return 0;

			this.list_cbed_detal = this.list_cbed_detal.filter((_, inx) => 
				inx != this.select_tr_inx
			)
			this.select_tr_inx = null
		},
		selectTr(inx, e) {
			if(this.select_tr_inx == inx && this.tr) {
				this.tr.classList.remove('td-row-all')
				return this.select_tr_inx = null
			}
			if(this.tr) 
				this.tr.classList.remove('td-row-all')
			this.tr = e
			this.tr.classList.add('td-row-all')

			this.select_tr_inx = inx
		},
		
		save_order() {
			if(
				!this.date_order || !this.date_shipments 
				|| !this.kol || !this.base 
				|| !this.select_product || !this.buyer
				) 
				return showMessage('', 'Все поля должны быть заполнены', 'w', this)

			const data = {
				date_order: this.date_order,
				date_shipments: this.date_shipments,
				kol: this.kol,
				day_when_shipments: this.day_when_shipments,
				bron: this.bron,
				base: this.base,
				buyer: this.buyer,
				to_sklad: this.to_sklad,
				product: {
					id: this.select_product.id,
					name: this.select_product.name
				},
				description: this.description,
				list_cbed_detal: JSON.stringify(this.list_cbed_detal),
			} 

			this.fetchCreateShipments(data).then(res => {
				setTimeout(() => this.$router.push('/issueshipment'), 3000)
				if(res) return showMessage('', 'Заказ успешно создан!, Перенаправление на страницу заказов.', 's', this)
				else return showMessage('', 'Произошла ошибка при создании заказа', 'e', this)
			})
		}
	},
	async mounted() {
		this.fetchAllBuyers()
	}
}
</script>
<style scoped>
table {
	width: 100%;
}
select {
	width: 100px;
}
label {
	margin:0px;
	padding: 0px;
	color: black;
	font-weight: bold;
	margin-left: 5px;
	font-size: 15px;
}
.input_kol {
	width: 20px;
}
.block p * {
	margin-left: 5px;
}
.block p input[type='text'], .block p input[type='number'] {
	width: 60px;
}
.table_block {
	display: flex;
}
.table_block div {
	margin: 10px;
}
textarea {
	height: 140px;
}
.out-btn-control{
  position: fixed;
  width: 85%;
  bottom: 10px;
}
.p_flex {
	display: flex;
	align-items: center;
}
</style>