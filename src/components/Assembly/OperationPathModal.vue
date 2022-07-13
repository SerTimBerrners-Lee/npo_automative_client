<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Путь сборочной единицы</h3>
        <div class="block"> 
					<table>
						<tr>
							<th>№ Заказа</th>
							<th>Срок отгрузки</th>
							<th>Изделие</th> 
							<th>Сборочная единица</th>
							<th>Артикул</th>
							<th>Кол-во, шт</th>
							<th>Готовность %</th>
							<th>Готовность к сборке</th>
						</tr>
						<tr v-for='shipments of assemble?.cbed?.shipments || []' :key='shipments'>
							<td>{{ assemble?.number_order }}</td>
							<td>{{ assemble?.date_shipments }}</td>
							<td>{{ shipments?.product.name }}</td>
							<td>{{ assemble?.cbed.name}}</td>
							<td>{{ shipments?.product.articl }}</td>
							<td class='center'>{{ shipments?.kol }}</td>
							<td class='center'>{{ 0 }}</td>
							<td class='center'>{{ 0 }}</td>
						</tr>
					</table>
        </div> 

        <ComplectationCbed 
          :izdel='assemble.cbed'
        />
 
        <OperationTable 
          :tp='props_tp' 
          :izdeles='props_izdeles'
          v-if='props_tp'
        />
				
				<div class="btn-control out-btn-control" style='position:fixed; bottom: 10px; width: 58%;'>
					<button class="btn-status btn-black" 
						style="height: 0px;">Печать</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ComplectationCbed from './ComplectationTable';
import OperationTable from '@/components/Sclad/OperationPathInfo';

export default { 
  props: ['assemble'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',

			shipments: null,
      tp: null,
      props_tp: null, 
      props_izdeles: null,

      typeOperation: null
    }
  },
  components: { OperationTable, ComplectationCbed },
  computed: mapGetters(['']),
  methods: {
    ...mapActions(['fetchAllShipmentsById', 'getAllTypeOperations']),
		destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    if(this.$props.assemble && this.$props.assemble?.tech_process) {
      this.props_izdeles = this.$props.assemble
      this.props_tp = this.$props.assemble?.tech_process
    }
    
		if(this.$props.assemble && this.$props.assemble.shipments) 
			this.fetchAllShipmentsById(this.$props.assemble.shipments.id).then(response => this.shipments = response)
  }
}
</script>

<style scoped>
.table-end {
  margin-bottom: 100px;
}
.span-type-files-pdf {
  height: 500px;
}
#viewer-frame-pdf {
  width: 100%;
  height: 100%;
}
.abnf{
  padding: 10px;
  cursor: pointer;
}
.slider {
  margin: 5px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 10px;
  user-select: none;
}
.left-block {
  width: 40%;
}
.left-block p {
  margin-top: 8px;
}
.left-block p span {
  padding: 2px;
}
.right-block{ 
  width: 60%;
  display: flex;
  justify-content: end;
  flex-direction: column;
}
textarea {
  height: 90px;
  width: 90%;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
h4 {
  font-weight: inherit;
  font-size: 20px;
}
.main-fb-modal-block p {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.main-fb-modal-block {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}
.main-fb-modal-block>p * {
  margin-left: 10px;
}
.fb-img-block {
  width: 100%;
  height: 300px;
}
.out-btn-control {
  margin-top: 10px;
}
table{
  width: 100%;
}
table th {
  text-align: start;
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
  max-width: 100%;
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

  width: 60%;
}
.left-block-modal {
  width: 40%;
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
    width: 1vw;
  }
  to {
    width: 60%;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 60%;
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
    width: 40%;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 40%;
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