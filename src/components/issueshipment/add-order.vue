<template>
	<div>
		<h3>Создать заказ</h3>
		<div class="block">
			<p class='p_flex'>
				<!-- <span>Номер заказа: </span>
				<input type="text" v-model='number_order'> -->
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
				<input type="number" min='1' v-model='kolvo'>
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
						<td>
							<input 
								type="text" 
								:value='obj.kolvo'
								class='input_kol' 
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
				<textarea  v-model='description'></textarea>
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
	<InformFolder  :title='titleMessage'
		:message = 'message'
		:type = 'type'
		v-if='showInformPanel'
		:key='keyInformTip'
    />
	</div>
</template>

<script>
import DatePicterCustom from '@/components/date-picter.vue';
import ProductList from '@/components/baseproduct/all-product-modal.vue';
import BaseProductModal from '@/components/baseproduct/base-product-all-modal.vue';
import InformFolder from '@/components/InformFolder.vue';
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
      showInformPanel: false,
      keyInformTip: 0,

			select_tr_inx: null,
			tr: null,
			
			date_order: new Date().toLocaleDateString("ru-RU"),
			date_shipments: new Date().toLocaleDateString("ru-RU"),
			kolvo: '',
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
	computed: mapGetters(['allBuyer']),
	components: {DatePicterCustom, ProductList, BaseProductModal, InformFolder},
	methods: {
		...mapActions(['fetchCreateShipments', 'fetchAllBuyers']),
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
			
			this.select_product = product
	
			if(product.cbeds && product.cbeds.length && product.listCbed) {
				let list_cbed = JSON.parse(product.listCbed)
				this.getElement(product.cbeds, list_cbed, 'cbed')
			}
			if(product.detals && product.detals.length && product.listDetal) {
				let list_detal = JSON.parse(product.listDetal)
				this.getElement(product.detals, list_detal, 'detal')
			}
			
		},
		getElement(elements, list_pars, type, ) {
			for(let element of elements) {
				let kolvo = 1;
				for(let item of list_pars) {
					let id = type =='cbed' ? item.cb.id : item.det.id
					if(id== element.id)	
						kolvo = item.kol
				}
				this.list_cbed_detal.push({
					type,
					obj: {id: element.id, name: element.name},
					kolvo
				})
			}
		},
		responseDetalCb(res) {
			this.list_cbed_detal.push({
				...res, 
				obj: {id: res.obj.id, name: res.obj.name},
				kolvo: 1
			})
		},
		editKolVo(inx, val) {
			this.list_cbed_detal[inx].kolvo = val
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
				|| !this.kolvo || !this.base 
				|| !this.select_product
				|| !this.description || !this.buyer
				) 
				return showMessage('', 'Все поля должны быть заполнены', 'w', this)

			const data = {
				date_order: this.date_order,
				date_shipments: this.date_shipments,
				kolvo: this.kolvo,
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

			console.log(234234)
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