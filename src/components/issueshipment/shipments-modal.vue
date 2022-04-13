<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 
		<div>

		<h4 v-if='getOneShipments.parent_id'>Принадлежит к заказу</h4>	
		<TableShipments  
			v-if='getShipments.length && Number(this.$route.params.parent) || getOneShipments.parent_id'
			:shipmentsArr='getShipments'
			:fixed_table='"fixed_table_10"'
			:no_set='true'/>

		<div v-if='childrens.length'>
			<h4>Прикрепленные заказы</h4>
			<TableShipments  
				v-if='childrens.length'
				:fixed_table='"fixed_table_10"'
				:shipmentsArr='childrens'
				:no_set='true'/>
		</div>

		<h3>Заказ {{number_order}}</h3>
		<div class="block">
			<p class='p_flex'>
				<span>Дата заказа:</span>
				<DatePicterCustom
					:dateStart='date_order'
				/>
				<span>Выбранное изделие: </span>
				<span 
					v-if='select_product && !is_not_product' 
					class='select_span_href' @click='openIzd(select_product)'>{{ sliceName(select_product.name) }}</span>
				<label for='is_not_product'>Заказ без изделия:</label>
				<input id='is_not_product' type="checkbox" v-model='is_not_product' disabled>
				<span>Количество:</span>
				<input type="number" min='1' v-model='kol' disabled>
			</p>
			<p class='p_flex'>
				<span>Дата отгрузки:</span>
				<DatePicterCustom
					:dateStart='date_shipments'
				/>
				<label for='bran'>Бронь:</label>
				<input id='bran' type="checkbox" v-model='bron' disabled>
				<label for='file_folder' class='hover' v-if='!to_sklad'>Основание:</label>
				<input id='file_folder' type="file" hidden @change="e => addDock(e.target, true)" disabled>
				<span class='active' style='margin-left: 20px; margin-right: 20px;'>{{ base }}</span>
				<span class='hover'>Покупатель:</span>
				<select 
					class="select-small" 
					v-model='buyer'
					disabled>
					<option v-for='buyer in allBuyer' 
						:key='buyer'
						:value="buyer.id">{{ buyer.name }}</option>
				</select>
				<span>
					<label for='to_sklad'>На склад:</label>
					<input id='to_sklad' type="checkbox" v-model='to_sklad' disabled>
				</span>
			</p>
		</div>
		<div class='table_block'>
			<div>
				<h3>Комплектация изделия</h3>
				<table>
					<tr>
						<th>
							<unicon name="check" fill="royalblue" />
						</th> 
						<th>№</th>
						<th>Артикул</th>
						<th>Наименование СБ или детали</th>
						<th>Кол-во</th>
					</tr>
					<tr 
						v-for='(obj, inx) of list_cbed_detal' 
						:key='obj'
						class='td-row' @click='e => selectTr(inx, e.target.parentElement)'>
						<td>
							<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
								<p class="checkbox_block" @click='e => toSetShipments(obj, e.target)'></p>
							</div>
						</td>
						<td class='center'>{{ inx + 1 }}</td>
						<td>{{ obj.obj?.articl }}</td>
						<td @click='showInformIzdel(obj.obj?.id, obj?.type)'>{{ obj.obj?.name }}</td>
						<td class='center'>
							<input 
								type="text" 
								:value='obj.kol'
								class='input_kol center' 
								@change="e => editKolVo(inx, e.target.value)">
						</td>
					</tr>
				</table>
			</div>
			<div width='300px;' class='flex_direction'>
				<div>
					<h3>Примечание</h3>
					<textarea maxlength='250' v-model='description' disabled></textarea>
				</div>
				<div class='file_content'>
				<h3>Документы</h3>
				<div v-if='documents.length'>
					<table>
						<tr>
							<th>Файл</th>
						</tr>
						<tr v-for='fil of documents' :key='fil' class='td-row' @click='setDocs(fil)'>
							<td>{{ fil.name }}</td>
						</tr>
					</table>
				</div>
			</div>
			</div>
		</div>
		
		<PrintComplect v-if='tablebody' :shipments='getOneShipments' /> 

		<div v-if='shipment_sclad'>
			<div class='table_block'>
				<div>
					<h3>Выбранные позиции для отгрузки</h3>
					<table>
						<tr>
							<th>
								<unicon name="glass-tea" fill="#ee0942d0" width='20' />
							</th> 
							<th>№</th>
							<th>Артикул</th>
							<th>Наименование СБ или детали</th>
							<th>Кол-во</th>
						</tr>
						<tr 
							v-for='(obj, inx) of selectedsCbEd' 
							:key='obj'
							class='td-row' @click='e => selectTr(inx, e.target.parentElement)'>
							<td>
								<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
									<p class="checkbox_block_del" @click='e => toSetShipments(obj, e.target)'></p>
								</div>
							</td>
							<td class='center'>{{ inx + 1 }}</td>
							<td>{{ obj.obj?.articl }}</td>
							<td @click='showInformIzdel(obj.obj?.id, obj?.type)'>{{ obj.obj?.name }}</td>
							<td class='center'>
								<input 
									type="text" 
									:value='obj.kol'
									class='input_kol center' 
									disabled>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div class='btn-control'>
				<button class="btn-small btn-add" @click='openShipment'>Отгрузить</button>
			</div>
		</div>
		<div class='btn-control'>
				<button class="btn-small btn-add" @click='printPage'>Печать</button>
			</div>
		<OpensFile 
			:parametrs='itemFiles' 
			v-if="itemFiles" 
			:key='keyWhenModalGenerateFileOpen'
		/>
		<DetalModal
			:key='detalModalKey'
			v-if='parametrs_detal'
			:id='parametrs_detal'
		/>
		<CbedModalInfo
			:id='parametrs_cbed'
			:key='cbedModalKey'
			v-if='parametrs_cbed'
		/>
		<BaseFileModal 
			v-if='showModalFile'
			:key='fileModalKey'
			:fileArrModal='documentsData'
			@unmount='unmount_filemodal'
		/>
		<ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
		<Shipment 
      v-if='showShipmentModal && getOneShipments'
      :key='shipmentKey'
      :shipments_id='getOneShipments.id'
			:change_complect='selectedsCbEd'
      :shipment_sclad='true'
      @unmount='unmount_sh_complit'
    />
		<Loader v-if='loader' :description='"Загрузка Заказов"' />
		</div>
      
    </div>
  </div>
</div>
</template>
<script>
import { random } from 'lodash';
import PrintComplect from './print_complect';
import { 	eSelectSpan,
					sliceName,
					getBuyerFilter } from '@/js/methods';
import OpensFile from '@/components/filebase/openfile';
import DatePicterCustom from '@/components/date-picter';
import CbedModalInfo from '@/components/cbed/cbed-modal';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import DetalModal from '@/components/basedetal/detal-modal';
import BaseFileModal from '@/components/filebase/base-files-modal';
import Shipment from '@/components/sclad/issuetopull/sh-comlit.modal';
import ProductModalInfo from '@/components/baseproduct/product-modal';
import TableShipments from '@/components/issueshipment/table-komplect';

export default {
  props: {
		id_shipments: {},
		shipment_sclad: {
			type: Boolean
		}
	},
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

			keyWhenModalGenerate: random(1, 999),
			keyWhenModalGenerateFileOpen: random(1, 999),

			number_order: 0,

			select_tr_inx: null,
			tr: null,
			formData: new FormData,
			baseFormData: new FormData,
			documents: [],
			itemFiles: null,

			detalModalKey: random(1, 999),
			parametrs_detal: false,
			parametrs_cbed: null,
			cbedModalKey: random(1, 999),
			documentsData: [],
			
			date_order: new Date().toLocaleDateString("ru-RU"),
			date_shipments: new Date().toLocaleDateString("ru-RU"),
			kol: 1,
			bron: false,
			base: '',
			buyer: 0,
			to_sklad: false,
			select_product: null,
			description: '',
			list_cbed_detal: [],
			is_not_product: false,

			parametrs_product: false,
			productModalKey: random(1, 999),

			showShipmentModal: false,
      shipmentKey: random(1, 999),

			showModalFile: false,
      fileModalKey: random(1, 999),
			selectedBaseProvesses: false,
			selectedsCbEd: [],

			tablebody: false,
			loader: false,
			childrens: [],
    }
  },
  watch: {
		kol: function(znach) {
			if(!this.select_product) return 0;
			this.list_cbed_detal = [];
			for(let inx = 0; inx < znach; inx++) {
				this.checkedJsonList(this.select_product);
			}
		},	
	},
	computed: mapGetters([	
		'allBuyer',
		'getOneShipments',
		'getShipments'
	]),
	components: {
		DatePicterCustom, 
		OpensFile,
		DetalModal,
		CbedModalInfo,
		TableShipments,
		BaseFileModal,
		ProductModalInfo,
		Shipment,
		PrintComplect
	},
	methods: {
		...mapActions([
			'fetchAllBuyers',  
			'getAllProductByIdLight',
			'fetchAllShipmentsTo',
			'fetchAllShipmentsById',
			'fetchIncludesFolderSh'
		]),
		...mapMutations(['setOneShipment']),
		destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';

			this.$emit('unmount_shpment');
		},
		async unmount_sh_complit() {
			this.loader = true;
      await this.fetchAllShipmentsTo();
			this.loader = false;
		},
		printPage() {
			this.getOneShipments.buyer_name = getBuyerFilter(this.getOneShipments?.buyer?.id);
			this.tablebody = true;
			setTimeout(() => this.tablebody = false, 4000);
    },
		toSetShipments(obj, el) {
			el.classList.toggle('checkbox_block_select');
			setTimeout(() => {
				if (this.tr) this.tr.classList.remove('td-row-all');
			});

			let find = false;
			for (const item of this.selectedsCbEd) {
				if (item.obj.id == obj.obj.id && item.type == obj.type) find = true;
			}

			if (!find) {
				this.list_cbed_detal = this.list_cbed_detal.filter(el => ((el.obj.id != obj.obj.id) && (el.type == obj.type)));
				this.selectedsCbEd.push(obj);
			} else {
				this.list_cbed_detal.push(obj);
				this.selectedsCbEd = this.selectedsCbEd.filter(el => ((el.obj.id != obj.obj.id) && (el.type == obj.type)));
			}
		},
		editKolVo(inx, val) {
			this.list_cbed_detal[inx].kol = Number(val);
		},
		setDocs(dc) {
      this.itemFiles = dc;
      this.keyWhenModalGenerateFileOpen = random(10, 999);
    },
		selectTr(inx, e) {
			if(this.select_tr_inx == inx && this.tr) 
				return this.select_tr_inx = null;

			this.tr = eSelectSpan(this.tr, e);
			this.select_tr_inx = inx;
		},
		async editVariable() {
			this.date_order = this.getOneShipments.date_order;
			this.date_shipments = this.getOneShipments.date_shipments;
			this.kol = this.getOneShipments.kol;
			this.bron = this.getOneShipments.bron;
			this.base = this.getOneShipments.base;
			this.buyer = this.getOneShipments.buyer?.id;
			this.to_sklad = this.getOneShipments.to_sklad;
			this.number_order = this.getOneShipments.number_order;
			if(this.getOneShipments.productId) {
				const res = await this.getAllProductByIdLight(this.getOneShipments.productId);
				if (res) this.select_product = res;
			} else this.is_not_product = true;

			if(this.getOneShipments.documents) this.documents = this.getOneShipments.documents;
			
			try {
				if(this.getOneShipments.list_cbed_detal)
					this.list_cbed_detal = JSON.parse(this.getOneShipments.list_cbed_detal);
			} catch(e) {console.error(e)}

			this.description = this.getOneShipments.description;
		},
		showInformIzdel(id, type) {
			if(type == 'cbed') {
				if(id) {
					this.parametrs_cbed = id;
					this.cbedModalKey = random(1, 999);
				}
			}
			if(type == 'detal') {
				if(id) {
					this.parametrs_detal = id;
					this.detalModalKey = random(1, 999);
				}
			}
		},
		sliceName(str) {
			return sliceName(str, 32);
		},
		openIzd(izd) {
			if (!izd || !izd.id) return false;
			this.parametrs_product = izd.id;
      this.productModalKey = random(1, 999);
		},
		openShipment() {
      this.showShipmentModal = true;
      this.shipmentKey = random(1, 999);
    },
	},
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';
		console.log('mounted')

		this.loader = true;

		await this.fetchAllBuyers(true);
		await this.fetchAllShipmentsTo();

		this.list_cbed_detal = [];

		if(!this.id_shipments) return this.destroyModalF();
		const result = await this.fetchAllShipmentsById({id: this.id_shipments, light: true});

		if(!result) return this.destroyModalF();
		this.setOneShipment(result);
		this.editVariable();

		const childrens = await this.fetchIncludesFolderSh({ id: result.id, folder: 'childrens' });
		if (childrens && childrens.childrens) this.childrens = childrens.childrens;

		this.loader = false;
  },
}
</script>

<style scoped>
.flex_direction {
	display: flex;
}
.file_content {
	width: 500px;
	padding: 40px;
}
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
	cursor: pointer;
	user-select: none;
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
	flex-direction: column;
}
textarea {
	height: 140px;
}
.p_flex {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.p_flex>* {
	margin-top: 5px;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 70%;
}
.left-block-modal {
  width: 30%;
  height: 10000px;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1%;
  }
  to {
    width: 70%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 30%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 30vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 70vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>