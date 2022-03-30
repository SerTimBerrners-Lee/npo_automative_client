<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 
		<div>
		<TableShipments  
			v-if='getShipments.length && Number(this.$route.params.parent)'
			:shipmentsArr='getShipments'
			@unmount='unmount_table_shipments'/>
		<h3>Заказ {{number_order}}</h3>
		<div class="block">
			<p class='p_flex'>
				<span>Дата заказа:</span>
				<DatePicterCustom 
					@unmount='changeDatePicter' 
					:dateStart='date_order'
					/>
				<span>Выбрать изделие: </span>
				<span 
					v-if='select_product && !is_not_product' 
					class='select_span_href'>{{ select_product.name }}</span>
				<label for='is_not_product'>Заказ без изделия:</label>
				<input id='is_not_product' type="checkbox" v-model='is_not_product'>
				<span>Количество:</span>
				<input type="number" min='1' v-model='kol' :disabled='is_not_product'>
			</p>
			<p class='p_flex'>
				<span>Дата отгрузки:</span>
				<DatePicterCustom 
					@unmount='changeDatePicterShipments' 
					:dateStart='date_shipments'
				/>
				<label for='bran'>Бронь:</label>
				<input id='bran' type="checkbox" v-model='bron'>
				<label for='file_folder' class='hover' v-if='!to_sklad'>Основание:</label>
				<input id='file_folder' type="file" hidden @change="e => addDock(e.target, true)">
				<span class='active' style='margin-left: 20px; margin-right: 20px;'>{{ base }}</span>
				<span
					class='hover'
					@click='selectBuyer'>Покупатель:</span>
				<select 
					class="select-small" 
					v-model='buyer'
					:disabled='to_sklad'>
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
						<th>Артикул</th>
						<th>Наименование СБ или детали</th>
						<th>Кол-во</th>
					</tr>
					<tr 
						v-for='(obj, inx) of list_cbed_detal' 
						:key='obj'
						class='td-row' @click='e => selectTr(inx, e.target.parentElement)'>
						<td class='center'>{{ inx + 1 }}</td>
						<td>{{ obj.obj.articl }}</td>
						<td @click='showInformIzdel(obj.obj.id, obj.type)'>{{ obj.obj.name }}</td>
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
					<textarea maxlength='250' v-model='description'></textarea>
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
		<Loader v-if='loader' />
		</div>
      
    </div>
  </div>
</div>
</template>
<script>
import { random } from 'lodash';
import { eSelectSpan } from '@/js/methods.js';
import OpensFile from '@/components/filebase/openfile';
import DatePicterCustom from '@/components/date-picter';
import CbedModalInfo from '@/components/cbed/cbed-modal';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import DetalModal from '@/components/basedetal/detal-modal';
import BaseFileModal from '@/components/filebase/base-files-modal';
import TableShipments from '@/components/issueshipment/table-komplect';

export default {
  props: ['id_shipments'],
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
			list_hidden_cbed_detal: [],
			is_not_product: false,

			showModalFile: false,
      fileModalKey: random(1, 999),
			selectedBaseProvesses: false
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
		BaseFileModal
	},
	methods: {
		...mapActions([
			'fetchAllBuyers',  
			'getAllProductByIdLight',
			'fetchAllShipmentsTo',
			'fetchAllShipmentsById'
		]),
		...mapMutations(['setOneShipment']),
		destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';

			this.$emit('unmount_shpment');
		},
		changeDatePicter(date) {
			this.date_order = date;
		},
		changeDatePicterShipments(date) {
			this.date_shipments = date;
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
		editVariable() {
			this.date_order = this.getOneShipments.date_order;
			this.date_shipments = this.getOneShipments.date_shipments;
			this.kol = this.getOneShipments.kol;
			this.bron = this.getOneShipments.bron;
			this.base = this.getOneShipments.base;
			this.buyer = this.getOneShipments.buyer?.id;
			this.to_sklad = this.getOneShipments.to_sklad;
			this.number_order = this.getOneShipments.number_order;
			if(this.getOneShipments.productId) {
				this.getAllProductByIdLight(this.getOneShipments.productId)
				.then(res => this.select_product = res);
			} else this.is_not_product = true;

			if(this.getOneShipments.documents) this.documents = this.getOneShipments.documents;
			try {
				if(this.getOneShipments.list_cbed_detal)
					this.list_cbed_detal = JSON.parse(this.getOneShipments.list_cbed_detal);
				if(this.getOneShipments.list_hidden_cbed_detal)
					this.list_hidden_cbed_detal = JSON.parse(this.getOneShipments.list_hidden_cbed_detal);
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
		}
	},
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';

		this.loader = true;

		await this.fetchAllBuyers(true);
		await this.fetchAllShipmentsTo();

		this.list_cbed_detal = [];
		this.list_hidden_cbed_detal = [];

		if(!this.$props.id_shipments) return this.destroyModalF();
		const result = await this.fetchAllShipmentsById({id: this.$props.id_shipments, light: true});

		if(!result) return this.destroyModalF();
		this.setOneShipment(result);
		this.editVariable();

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
.table_block div {
	margin: 10px;
}
textarea {
	height: 140px;
}
.p_flex {
	display: flex;
	align-items: center;
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