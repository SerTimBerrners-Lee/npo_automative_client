<template>
	<div class='mini-modal'>
		<div class='cross' @click='exitModal'>
			<unicon name="times" fill="gray"  />
		</div>
		<button class='btn-small' @click="addingFileToDetal">			Присвоить к детали</button>
		<button class='btn-small' @click="addingFileToCbed">			Присвоить к Сборочной единице</button>
		<button class='btn-small' @click="addingFileToProduct">		Присвоить к Изделию</button>
		<button class='btn-small' @click="addingFileToEquipment">	Присвоить к Оборудованию</button>
		<button class='btn-small' @click="addingFileToTools">			Присвоить к Инструменту или оснастки</button>
		<button class='btn-small' @click="addingFileToMaterial">	Присвоить к Материалу</button>
		<button class='btn-small' @click="addingFileToProvider">	Присвоить к Поставщику</button>
		<button class='btn-small' @click="addingFileToBuyer">			Присвоить к Покупателю</button>
		<button class='btn-small' @click="addingFileToInventary">	Присвоить к Техники или инвентарю</button>
		<button class='btn-small' @click="addingFileToUser">			Присвоить к Пользователю</button>
	</div>
	<BaseDetalModal 
		v-if='showBFM'
		:key='generateKeyBFM'
		:get_one='true'
		@responsDetal='responsDetal' />
	<BaseCbedModal 
		v-if='showBFCbed'
		:key='generateKeyBFCbed'
		:get_one='true'
		@responsCbed='responsCbed'
	/>
	<BaseProductModal 
		v-if='showBFProduct'
		:key='generateKeyBFProduct'
		@unmount='responsProduct'
	/>
	<BaseEquipment 
    :key='generateKeyBFEquipment'
    v-if='showBFEquipment'
    @unmount_eq='responsEquipment'
		:get_one='true'
  />
	<BaseTools 
    :key='generateKeyBFTools'
    v-if='showBFTools'
    @unmount_instrument='responsTools'
		:get_one='true'
  />
	<ModalBaseMaterial 
		:key='generateKeyBFMaterial'
		v-if='showBFMaterial'
		@unmount_material='responsMaterials'
		:getOneMaterial='true'
	/>
	<ListProvider  
		@unmount='responsProvider' 
		:key='generateKeyBFProvider'
		v-if='showBFProvider'
		/>
	<ListBuyer  
		@unmount='responsBuyer' 
		:key='generateKeyBFBuyer'
		v-if='showBFBuyer'
		/>
	<BaseInventary
    :key='generateKeyBFInventary'
    v-if='showBFInventary'
    @unmount='responsInventary'
		:get_one='true'
  />
	<ModalUsersList 
		v-if='showBFUser'
		:key='generateKeyBFUser'
		:get_one='true'
		@unmount='responsUser'
	/>
	<InformFolder  
		:title='titleMessage'
		:message = 'message'
		:type = 'type'
		v-if='message'
		:key='keyInformTip'
	/>
</template>
<script>
import BaseDetalModal from '@/components/basedetal/base-detal-modal.vue';
import BaseProductModal from '@/components/baseproduct/all-product-modal.vue';
import BaseCbedModal from '@/components/cbed/base-cbed-modal.vue';
import BaseEquipment from '@/components/equipment/modal-base-equipment.vue';
import BaseTools from '@/components/instrument/modal-base-tool.vue';
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue';
import ListProvider from '@/components/baseprovider/list-provider.vue';
import ListBuyer from '@/components/basebuyer/base-buyer-modal.vue';
import BaseInventary from '@/components/inventary/modal-base-inventary.vue';
import ModalUsersList from '@/components/users/modal-list-user.vue';
import {mapActions} from 'vuex';
import {random} from 'lodash';
import { showMessage } from '@/js/';
export default {
	props: ['itemFiles'],
	data() {
		return {
			generateKeyBFM: random(1, 999),
			showBFM: false, 
			//Cbed
			generateKeyBFCbed: random(1, 999),
			showBFCbed: false, 
			//Product
			generateKeyBFProduct: random(1, 999),
			showBFProduct: false, 
			//Equipment
			generateKeyBFEquipment: random(1, 999),
			showBFEquipment: false, 
			//Tools
			generateKeyBFTools: random(1, 999),
			showBFTools: false, 
			//Material
			generateKeyBFMaterial: random(1, 999),
			showBFMaterial: false, 
			//Provider
			generateKeyBFProvider: random(1, 999),
			showBFProvider: false, 
			//Buyer
			generateKeyBFBuyer: random(1, 999),
			showBFBuyer: false, 
			//Inventary
			generateKeyBFInventary: random(1, 999),
			showBFInventary: false, 
			//User
			generateKeyBFUser: random(1, 999),
			showBFUser: false, 

			titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
		}
	},
	components: {
		BaseDetalModal,
		BaseCbedModal,	
		BaseProductModal,
		BaseEquipment,
		BaseTools,
		ModalBaseMaterial,
		ListProvider,
		ListBuyer,
		BaseInventary,
		ModalUsersList
	},
	methods: {
		...mapActions([
			'setDetalForFile',
			'attachFileToCbed',
			'attachFileToProduct',
			'attachFileToEquipment',
			'attachFileToInstrument',
			'attachFileToMaterial',
			'attachFileToProvider',
			'attachFileToBuyer',
			'attachFileToInventary',
			'attachFileToUser'
		]),
		addingFileToDetal() {
			this.generateKeyBFM = random(5, 999)
			this.showBFM = true
    },
    addingFileToCbed() {
			this.generateKeyBFCbed = random(1, 999)
			this.showBFCbed = true
    },
    addingFileToProduct() {
			this.generateKeyBFProduct = random(1, 999)
			this.showBFProduct = true
    },
    addingFileToEquipment() {
			this.generateKeyBFEquipment = random(1, 999)
			this.showBFEquipment = true
    },
    addingFileToTools() {
      this.generateKeyBFTools = random(1, 999)
			this.showBFTools = true
    },
    addingFileToMaterial() {
      this.generateKeyBFMaterial = random(1, 999)
			this.showBFMaterial = true
    },
    addingFileToProvider() {
      this.generateKeyBFProvider = random(1, 999)
			this.showBFProvider = true
    },
    addingFileToBuyer() {
      this.generateKeyBFBuyer = random(1, 999)
			this.showBFBuyer = true
    },
    addingFileToInventary() {
      this.generateKeyBFInventary = random(1, 999)
			this.showBFInventary = true
    },
    addingFileToUser() {
      this.generateKeyBFUser = random(1, 999)
			this.showBFUser = true
    },
		responsDetal(detal) {
      if(!detal || !this.itemFiles.id) return 0 
      this.setDetalForFile({id_detal: detal.id, id_document: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsCbed(cbed) {
      if(!cbed || !this.itemFiles.id) return 0 
      this.attachFileToCbed({cbed_id: cbed.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsProduct(product) {
      if(!product || !this.itemFiles.id) return 0 
      this.attachFileToProduct({product_id: product.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsEquipment(eq) {
      if(!eq || !this.itemFiles.id) return 0 
      this.attachFileToEquipment({eq_id: eq.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsTools(tools) {
      if(!tools || !this.itemFiles.id) return 0 
      this.attachFileToInstrument({instr_id: tools.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsMaterials(mat) {
      if(!mat.material || !this.itemFiles.id) return 0 
      this.attachFileToMaterial({mat_id: mat.material.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsProvider(provider) {
				if(!provider || !this.itemFiles.id) return 0 
      this.attachFileToProvider({provider_id: provider.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsBuyer(buyer) {
      if(!buyer || !this.itemFiles.id) return 0 
      this.attachFileToBuyer({buyer_id: buyer.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsInventary(inventary) {
      if(!inventary || !this.itemFiles.id) return 0 
      this.attachFileToInventary({inventary_id: inventary.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
    responsUser(user) {
      if(!user || !this.itemFiles.id) return 0 
      this.attachFileToUser({user_id: user.id, file_id: this.itemFiles.id}).then(() => showMessage('', 'Файл успешно прекреплен', 's', this))
    },
		exitModal() {
			this.$emit('unmount', false)
		}
	},
	async mounted() {
		if(!this.$props.itemFiles) return false
	}
}
</script>

<style scoped>
.mini-modal {
  background-color: #464646;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  padding: 15px 15px;
  border-left: 3px solid rgba(61, 150, 34, 0.788);
  position: fixed;
	display: flex;
	flex-direction: column;
	left: 0px;
	right: 0px;
	width: 300px;
	bottom: 200px;
	height: max-content;
	margin: 0 auto;
}
.mini-modal * {
	margin: 5px;
}
.cross{
	cursor: pointer;
	text-align: end;
}
</style>>