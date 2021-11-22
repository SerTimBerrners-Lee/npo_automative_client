<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 

      <div class="right_info_block" >
				<h3>Краткая Информация о Изделии</h3>
				<div class="block" v-if='selecteProduct'>
					<p class='name_parg'>
						<span class="title_span">Наименование: </span><span>{{ selecteProduct.name }}</span>
					</p>
					<p class='name_parg'>
						<span class="title_span">Артикул: </span><span>{{ selecteProduct.articl }}</span>
					</p>
					<MediaSlider :width='"width: 93%;"' v-if='selecteProduct.documents.length' :data='selecteProduct.documents' :key='selecteProduct.documents' />
					<div>
						<h3>Спетификация Сборочной единицы</h3>
						<TableSpetification
							:listCbed='listCbed'
							:listDetal='listDetal'
							:listPokDet='listPokDet'
							:materialList='materialList'
						/>
					</div>
					<div>
						<h3>Характеристики</h3>
						<div>
							<p v-for='har in JSON.parse(selecteProduct.haracteriatic)' :key='har'>
								<span>{{ har.name }}({{har.ez}}): </span>
								<span style='font-weight:bold;'>{{ har.znach }} </span>
							</p>
						</div>
					</div>
					<div v-if='selecteProduct.parametrs'>
						<h3>Параметры</h3>
						<p v-for='par in JSON.parse(selecteProduct.parametrs)' :key='par'>
							<span>{{ par.name }}({{par.ez}}): </span>
							<span style='font-weight:bold;'>{{ par.znach }} </span>
						</p>
					</div>
					<div>
						<h3>Описание / Примечание</h3>
						<textarea 
							maxlength='250' 
							style="width: 90%; height: 120px;" 
							:value='selecteProduct.description'> </textarea>
					</div>
					<div 
						class='scroll-table' 
						style='width:100%' 
						v-if='selecteProduct.documents.length > 0'>
						<h3>Документы</h3>
						<table style="width: 100%;">
							<tr>
								<th>Файл</th>
							</tr>
							<tr class="td-row" 
								v-for='doc in selecteProduct.documents' 
								:key='doc' @click='setDocs(doc)'>
								<td>{{ doc.name }}</td>
							</tr>
						</table>
						<div class="btn-control">
						<button class="btn-small" @click='openDock'>Открыть</button>
						</div>
						<OpensFile 
							:parametrs='itemFiles' 
							v-if="showFile" 
							:key='keyWhenModalGenerateFileOpen'
						/>
					</div>
					<h3 class="link_h3" @click='showTechProcess' v-if='techProcessID'>Технологический процес</h3>
				</div>
      </div>
    </div>
  </div>
</div>
 <TechProcess 
    v-if='techProcessIsShow'
    :key='techProcessKey'
    :techProcessID='techProcessID'
  />
</template>

<script>
import TechProcess from '@/components/basedetal/tech-process-modal.vue';
import MediaSlider from '@/components/filebase/media-slider.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import TableSpetification from '@/components/cbed/table-sptification.vue';
import {mapGetters, mapMutations } from 'vuex';
import {isEmpty, random} from 'lodash';
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
      inputs: '',
      itemFiles: null,
      showFile: false,
      showProviders: false,
      keyProvidersModal: random(1, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
			selecteProduct: null,

			materialList: [],
      listPokDet: [],
      listDetal: [],
      listCbed: [],

      techProcessIsShow: false,
      techProcessKey: random(10, 999),
      techProcessID: null,
    }
  },
  computed: mapGetters([ 
      'getOneSelectDetal']),
  components: {OpensFile, MediaSlider, TechProcess, TableSpetification},
  methods: {
    ...mapMutations(['removeOperationStorage']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
      this.removeOperationStorage()
    },
    setDocs(dc) {
        this.itemFiles = dc
      },
    openDock() {
      if(isEmpty(this.itemFiles))
        return 0
      this.showFile = true
      this.keyWhenModalGenerateFileOpen = random(10, 999)
    },
    showTechProcess() {
      this.techProcessIsShow = true
      this.techProcessKey = random(1, 999)
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(isEmpty(this.$props.parametrs)) 
      return this.destroyModalF()
		console.log('this.$props.parametrs', this.$props.parametrs)
    this.selecteProduct = this.$props.parametrs
    
    if(this.selecteProduct.techProcesses)
      this.techProcessID = this.selecteProduct.techProcesses.id

		try {
			if(this.selecteProduct.materialList)
				this.materialList = JSON.parse(this.selecteProduct.materialList)
			if(this.selecteProduct.listPokDet)
				this.listPokDet = JSON.parse(this.selecteProduct.listPokDet)
			if(this.selecteProduct.listDetal)
				this.listDetal = JSON.parse(this.selecteProduct.listDetal)
			if(this.selecteProduct.listCbed)
				this.listCbed = JSON.parse(this.selecteProduct.listCbed)
		} catch(e) {console.error(e)}

  },
}
</script>

<style scoped>
.informat {
  z-index: 10;
}
.right-menu-p>input {
  width: 70%;
}
.input_znach {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
}
.input_znach p {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  margin: 0;
  width: 100%;
}
.select-small{
  font-size: 14px;
  padding: 5px;
  font-weight: bolder;
}
.block p * {
  margin-left: 10px;
}
.block p {
  display: flex;
  justify-content: start;
}
.block p input {
  width: 76%;
}
.select-small {
  width : 100%;
  height: 100%;
  margin: 0;
  border: none;
}
.out-btn-control{
  margin-top: 10px;
}
.p-types{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.p-types span:first-child {
  font-weight: bold;
}
table {
  user-select: none;
}
</style>