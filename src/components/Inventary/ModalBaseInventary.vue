<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Добавление Техники или инвентаря</h3>
        <div class="body_table_instr">
					<TableMaterial 
					:title='"Тип"' 
					:alltypeM="getTInventary" 
					:type='"T"' 
					@search='searchT'
					@clickMat="clickTInventary"/>
				<TableMaterial 
					:title='"Подтип"' 
					:alltypeM="getPTInventary" 
					:type="'PT'" 
					@search='searchTP'
					@clickMat="clickPTInventary"/>
				<TableMaterial :title='" Наименование"' 
					:alltypeM="getInventary" 
					:type="'PPT'" 
					@search='search'
					@clickMat="clickInventary"/>
        </div>
        <div class="btn-control body_table_instr">
          <button class="btn-small btn-add" v-if='!get_one' @click='addInventaryToList'>Выбрать</button>
          <button class="btn-small btn-add" v-if='get_one' @click='returnOneInventary'>Выбрать</button>
        </div>
        <div class="btn-control out-btn-control" v-if='!get_one'>
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black" style="height: 0px;" @click='addInventary'>Добавить выбранное</button>
        </div>
      </div>
    </div>
  </div> 
</template>
<script>
import { random } from 'lodash'
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableMaterial from '@/components/MathZag/TableMaterial';

export default {
  props: ['listEquipment','get_one'],
  data() {
    return {
      inventaryT: null,
      inventaryPT: null,
      inventary: null,

      showModalInformationEq: false,
      keyModalInformation: random(1, 999),

      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',

      inventaryList: [],
      inventaryListId: []
    }
  },
  computed: mapGetters([
		'getTInventary', 
    'getPTInventary',
    'getInventary',
    'getOneInventary'
	]),
  components: {TableMaterial},
  methods: {
    ...mapActions([
      'fetchAllInventary',
      'fetchAllPInventary',
      'fetchOneInventary',
      'fetchAllNameInventary',
      ]),
    ...mapMutations([
     'filterPTByTInvetary', 
      'resetFilterTInventary',
      'searchTInventary',
      'searchPTInventary',
      'searchInventary',
      'filterNameMaterialByPT',
      'resetFilterInventary'
		]),
		destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    search(val) {
      this.searchInventary(val)
    },
    searchT(val) {
      this.searchTInventary(val)
    },
    searchTP(val) {
      this.searchPTInventary(val)
    },
    clickTInventary(inventary) {
      if(this.inventaryT && this.inventaryT.id == inventary.id) {
        this.resetFilterInventary()
        return this.resetFilterTInventary()
      }
      this.inventaryT = inventary
      this.filterPTByTInvetary(inventary)
      if(inventary.inventary)
        this.filterNameMaterialByPT(inventary.inventary)
    },
    clickPTInventary(inventary) {
      if(this.inventaryPT && this.inventaryPT.id == inventary.id) 
        return this.resetFilterInventary()
      this.inventaryPT = inventary
      if(inventary.inventary)
        this.filterNameMaterialByPT(inventary.inventary)
    },
    clickInventary(inventary) {
      this.inventary = inventary
      this.fetchOneInventary(inventary.id)
    },
		addInventaryToList() {
			if(!this.inventary) return false
		},
    returnOneInventary() {
      if(!this.inventary) return 0;
      this.$emit('unmount', this.inventary)
      return this.destroyModalF()
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    this.fetchAllInventary()
    this.fetchAllPInventary()
    this.fetchAllNameInventary()
  }
}
</script>

<style scoped>
.delete_span {
  font-size: 11px;
  cursor: pointer;
  display: flex;
  justify-content:center;
  align-items:center;
  color: rgb(211, 102, 102);
  border: none;
  font-weight: bold;
}
.delete_span:hover{
  color: rgb(184, 52, 52);
}
.body_table_instr {
width: 1150px;
display: flex;  
}
.table_rek{
  width: 420px;
}
.table-filter-bproveder th {
  width: 158px;
}
.left-block-bprovider {
  width: 528px;
  float: left;
}
.left-block-bprovider .btn-control {
  margin-top: 20px;
}
.right-block-bprovider {
  margin-left: 20px;
  width: 1030px;
}
.block {
  display: flex;
  flex-direction: column;
}
.flex-box-main {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.first-block-description p {
  margin-left: 5px;
  float: left;
  width: 30%;
}
.first-block-description input {
  width: 150px;
}
textarea {
  height: 90px;
  width: 350px;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
.block-d-r {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.block-d-r>div>div {
  margin: 5px;
  margin-top: 10px;
  margin-left: 5px;
}
.block-d-r>div {
  width: 50%;
}
.block-d-r th {
  text-align: start;
}
.btn-black {
  width:max-content;
  height: 45px;
}
.endgroup {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  align-items: end;
}
.provider_table {
  width: 520px;
}

.main-fb-modal-block p {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.main-fb-modal-block {
  display: flex;
  flex-wrap: wrap;
  width: 64%;
  justify-content: space-between;
}
.main-fb-modal-block>p * {
  margin-left: 10px;
}
.fb-img-block {
  width: 36%;
  float: left;
  height: 190px;
}
.scroll-table {
  width: 98%;
  height: 78vh;
}
.out-btn-control {
  margin-top: 10px;
}
.span-type-files {
  width: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 70px;
  color: #606060;
  background: #a4a4a4;
}
.imgShow-modal {
  height: 100%;
  width: 100%;
}
.imgShow-modal-div {
  display: flex;
  justify-content: center;
  widows: 100%;
  height: 100%;
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
  width: 80%;
}
.left-block-modal {
  width: 20%;
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
    width: 80%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 20%;
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
    width: 20vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 80vw;
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